from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Game(models.Model):
    STATUS_BACKLOG = "backlog"
    STATUS_PLAYING = "playing"
    STATUS_COMPLETED = "completed"
    STATUS_PAUSED = "paused"
    STATUS_DROPPED = "dropped"

    STATUS_CHOICES = [
        (STATUS_BACKLOG, "想玩"),
        (STATUS_PLAYING, "游玩中"),
        (STATUS_COMPLETED, "已通关"),
        (STATUS_PAUSED, "暂停"),
        (STATUS_DROPPED, "弃坑"),
    ]

    rawg_id = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    background_image = models.URLField(blank=True)
    description = models.TextField(blank=True)
    released = models.DateField(null=True, blank=True)
    metacritic = models.PositiveSmallIntegerField(null=True, blank=True)
    platforms = models.JSONField(default=list, blank=True)
    genres = models.JSONField(default=list, blank=True)
    rawg_rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    website = models.URLField(blank=True)
    developers = models.JSONField(default=list, blank=True)
    publishers = models.JSONField(default=list, blank=True)
    stores = models.JSONField(default=list, blank=True)
    screenshots = models.JSONField(default=list, blank=True)
    trailers = models.JSONField(default=list, blank=True)
    steamgriddb_id = models.PositiveIntegerField(null=True, blank=True)
    steamgrid_assets = models.JSONField(default=dict, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_BACKLOG)
    play_platform = models.CharField(max_length=120, blank=True)
    overall_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    graphics_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    story_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    gameplay_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    immersion_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    music_score = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    experience_tags = models.JSONField(default=list, blank=True)
    review = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "name"]

    def __str__(self):
        return self.name
