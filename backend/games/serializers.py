from rest_framework import serializers

from .models import Game


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            "id",
            "rawg_id",
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
            "steamgriddb_id",
            "steamgrid_assets",
            "status",
            "play_platform",
            "overall_score",
            "graphics_score",
            "story_score",
            "gameplay_score",
            "immersion_score",
            "music_score",
            "experience_tags",
            "review",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class RawgImportSerializer(serializers.Serializer):
    rawg_id = serializers.IntegerField(min_value=1)
