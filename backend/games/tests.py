from unittest.mock import patch

from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Game


class GameApiTests(APITestCase):
    def test_create_update_list_and_stats_game(self):
        create_response = self.client.post(
            reverse("game-list"),
            {
                "rawg_id": 3498,
                "name": "Grand Theft Auto V",
                "platforms": ["PC", "PlayStation 5"],
                "genres": ["Action"],
                "status": "completed",
                "overall_score": 9,
                "experience_tags": ["开放世界", "沉浸"],
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, 201)
        game_id = create_response.data["id"]

        patch_response = self.client.patch(
            reverse("game-detail", args=[game_id]),
            {"review": "城市感很强。", "music_score": 8},
            format="json",
        )

        self.assertEqual(patch_response.status_code, 200)
        self.assertEqual(patch_response.data["review"], "城市感很强。")

        list_response = self.client.get(reverse("game-list"), {"status": "completed"})

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.data), 1)

        stats_response = self.client.get(reverse("game-stats"))

        self.assertEqual(stats_response.status_code, 200)
        self.assertEqual(stats_response.data["total_games"], 1)
        self.assertEqual(stats_response.data["completed_games"], 1)
        self.assertEqual(stats_response.data["top_game"]["name"], "Grand Theft Auto V")

    def test_delete_game(self):
        game = Game.objects.create(rawg_id=1, name="Test Game")

        response = self.client.delete(reverse("game-detail", args=[game.id]))

        self.assertEqual(response.status_code, 204)
        self.assertEqual(Game.objects.count(), 0)

    @patch("games.views.fetch_game")
    def test_import_rawg_refreshes_official_fields_without_losing_review(self, mock_fetch_game):
        mock_fetch_game.return_value = {
            "rawg_id": 77,
            "name": "Imported Game",
            "slug": "imported-game",
            "background_image": "https://example.com/cover.jpg",
            "description": "Official description",
            "released": "2020-01-01",
            "metacritic": 88,
            "platforms": ["PC"],
            "genres": ["RPG"],
            "rawg_rating": 4.5,
            "website": "https://example.com",
            "developers": ["Studio"],
            "publishers": ["Publisher"],
            "stores": [{"name": "Steam", "domain": "store.steampowered.com", "url": ""}],
            "screenshots": [{"id": 1, "image": "https://example.com/screenshot.jpg"}],
            "trailers": [{"id": 2, "name": "Trailer", "preview": "https://example.com/preview.jpg", "video": ""}],
        }

        first_response = self.client.post(reverse("game-import-rawg"), {"rawg_id": 77}, format="json")

        self.assertEqual(first_response.status_code, 201)

        game = Game.objects.get(rawg_id=77)
        game.review = "My private note"
        game.overall_score = 10
        game.save()

        mock_fetch_game.return_value["description"] = "Updated official description"
        second_response = self.client.post(reverse("game-import-rawg"), {"rawg_id": 77}, format="json")

        self.assertEqual(second_response.status_code, 200)
        game.refresh_from_db()
        self.assertEqual(game.description, "Updated official description")
        self.assertEqual(game.review, "My private note")
        self.assertEqual(game.overall_score, 10)

    @patch("games.views.fetch_game_media")
    def test_media_endpoint_fetches_and_caches_media_when_missing(self, mock_fetch_game_media):
        game = Game.objects.create(rawg_id=90, name="Media Game", developers=["Cached Studio"])
        mock_fetch_game_media.return_value = {
            "screenshots": [{"id": 10, "image": "https://example.com/shot.jpg"}],
            "trailers": [{"id": 11, "name": "Launch", "preview": "https://example.com/preview.jpg", "video": ""}],
        }

        response = self.client.get(reverse("game-media", args=[game.id]))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["screenshots"][0]["image"], "https://example.com/shot.jpg")
        game.refresh_from_db()
        self.assertEqual(game.screenshots[0]["id"], 10)

    @patch("games.views.fetch_artwork_for_game")
    def test_artwork_endpoint_fetches_and_caches_steamgriddb_assets(self, mock_fetch_artwork):
        game = Game.objects.create(rawg_id=91, name="Artwork Game")
        mock_fetch_artwork.return_value = {
            "steamgriddb_id": 123,
            "assets": {
                "poster": {"url": "https://example.com/poster.png"},
                "hero": {"url": "https://example.com/hero.png"},
                "logo": {"url": "https://example.com/logo.png"},
            },
        }

        response = self.client.get(reverse("game-artwork", args=[game.id]))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["steamgriddb_id"], 123)
        game.refresh_from_db()
        self.assertEqual(game.steamgrid_assets["hero"]["url"], "https://example.com/hero.png")
