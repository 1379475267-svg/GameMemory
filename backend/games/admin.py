from django.contrib import admin

from .models import Game


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "overall_score", "play_platform", "released", "updated_at")
    list_filter = ("status", "released")
    search_fields = ("name", "play_platform", "review")
    readonly_fields = ("created_at", "updated_at")
