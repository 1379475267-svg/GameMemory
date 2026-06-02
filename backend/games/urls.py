from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GameViewSet, stats

router = DefaultRouter()
router.register("games", GameViewSet, basename="game")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/", stats, name="game-stats"),
]
