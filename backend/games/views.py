from collections import Counter

from django.db.models import Avg
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import Game
from .serializers import GameSerializer, RawgImportSerializer
from .services.rawg import RawgClientError, fetch_game, fetch_game_media, fetch_trending_games, search_games
from .services.steamgriddb import fetch_artwork_for_game


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_value = self.request.query_params.get("status")
        if status_value:
            queryset = queryset.filter(status=status_value)
        return queryset

    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response({"detail": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(search_games(query))

    @action(detail=False, methods=["get"])
    def trending(self, request):
        return Response(fetch_trending_games())

    @action(detail=False, methods=["post"])
    def import_rawg(self, request):
        serializer = RawgImportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        rawg_id = serializer.validated_data["rawg_id"]
        game_data = fetch_game(rawg_id)
        game, created = Game.objects.get_or_create(
            rawg_id=rawg_id,
            defaults=game_data,
        )

        if not created:
            official_fields = [
                "name",
                "slug",
                "background_image",
                "description",
                "released",
                "metacritic",
                "platforms",
                "genres",
                "rawg_rating",
                "website",
                "developers",
                "publishers",
                "stores",
                "screenshots",
                "trailers",
            ]
            for field in official_fields:
                setattr(game, field, game_data.get(field))
            game.save(update_fields=official_fields + ["updated_at"])

        response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(GameSerializer(game).data, status=response_status)

    @action(detail=True, methods=["get"])
    def media(self, request, pk=None):
        game = self.get_object()
        needs_official_media = not (game.developers or game.publishers or game.stores or game.website)
        needs_visual_media = not game.screenshots and not game.trailers

        if needs_official_media:
            try:
                game_data = fetch_game(game.rawg_id)
                media_fields = [
                    "website",
                    "developers",
                    "publishers",
                    "stores",
                    "screenshots",
                    "trailers",
                ]
                for field in media_fields:
                    setattr(game, field, game_data.get(field))
                game.save(update_fields=media_fields + ["updated_at"])
            except RawgClientError:
                if needs_visual_media:
                    media = fetch_game_media(game.rawg_id)
                    game.screenshots = media["screenshots"]
                    game.trailers = media["trailers"]
                    game.save(update_fields=["screenshots", "trailers", "updated_at"])
        elif needs_visual_media:
            media = fetch_game_media(game.rawg_id)
            game.screenshots = media["screenshots"]
            game.trailers = media["trailers"]
            game.save(update_fields=["screenshots", "trailers", "updated_at"])

        return Response(
            {
                "screenshots": game.screenshots,
                "trailers": game.trailers,
                "stores": game.stores,
                "developers": game.developers,
                "publishers": game.publishers,
                "website": game.website,
            }
        )

    @action(detail=True, methods=["get"])
    def artwork(self, request, pk=None):
        game = self.get_object()

        if not game.steamgrid_assets:
            artwork = fetch_artwork_for_game(game.name)
            game.steamgriddb_id = artwork["steamgriddb_id"]
            game.steamgrid_assets = artwork["assets"]
            game.save(update_fields=["steamgriddb_id", "steamgrid_assets", "updated_at"])

        return Response(
            {
                "steamgriddb_id": game.steamgriddb_id,
                "assets": game.steamgrid_assets,
            }
        )


@api_view(["GET"])
def stats(request):
    games = Game.objects.all()
    scored_games = games.exclude(overall_score__isnull=True)
    tag_counter = Counter(tag for game in games for tag in game.experience_tags)
    top_game = scored_games.order_by("-overall_score", "name").first()

    return Response(
        {
            "total_games": games.count(),
            "completed_games": games.filter(status=Game.STATUS_COMPLETED).count(),
            "average_score": scored_games.aggregate(value=Avg("overall_score"))["value"],
            "top_tags": [{"tag": tag, "count": count} for tag, count in tag_counter.most_common(8)],
            "top_game": GameSerializer(top_game).data if top_game else None,
        }
    )
