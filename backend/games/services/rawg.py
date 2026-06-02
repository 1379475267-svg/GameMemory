from datetime import date, timedelta

import requests
from django.conf import settings
from rest_framework.exceptions import APIException


RAWG_BASE_URL = "https://api.rawg.io/api"


class RawgConfigurationError(APIException):
    status_code = 503
    default_detail = "RAWG API key is not configured on the backend."


class RawgClientError(APIException):
    status_code = 502
    default_detail = "RAWG API request failed. Please try again later or choose another result."


def _request(path, params=None):
    if not settings.RAWG_API_KEY:
        raise RawgConfigurationError()

    query = {"key": settings.RAWG_API_KEY}
    if params:
        query.update(params)

    try:
        response = requests.get(f"{RAWG_BASE_URL}{path}", params=query, timeout=12)
        response.raise_for_status()
    except requests.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else "unknown"
        raise RawgClientError(f"RAWG API returned HTTP {status_code}. Please try again later or choose another result.") from exc
    except requests.RequestException as exc:
        raise RawgClientError() from exc

    return response.json()


def search_games(query):
    data = _request(
        "/games",
        {
            "search": query,
            "page_size": 12,
            "search_precise": "true",
        },
    )
    return [normalize_search_result(item) for item in data.get("results", [])]


def fetch_trending_games():
    today = date.today()
    start_date = today - timedelta(days=540)
    end_date = today + timedelta(days=180)
    data = _request(
        "/games",
        {
            "page_size": 12,
            "ordering": "-added",
            "dates": f"{start_date.isoformat()},{end_date.isoformat()}",
        },
    )
    return [normalize_search_result(item) for item in data.get("results", [])]


def fetch_game(rawg_id):
    detail = normalize_game_detail(_request(f"/games/{rawg_id}"))
    detail.update(fetch_game_media(rawg_id))
    return detail


def fetch_game_media(rawg_id):
    media = {
        "screenshots": [],
        "trailers": [],
    }

    try:
        screenshot_data = _request(f"/games/{rawg_id}/screenshots", {"page_size": 8})
        media["screenshots"] = [
            {
                "id": item.get("id"),
                "image": item.get("image"),
            }
            for item in screenshot_data.get("results", [])
            if item.get("image")
        ]
    except RawgClientError:
        media["screenshots"] = []

    try:
        movie_data = _request(f"/games/{rawg_id}/movies", {"page_size": 4})
        media["trailers"] = [
            {
                "id": item.get("id"),
                "name": item.get("name") or "Trailer",
                "preview": item.get("preview"),
                "video": item.get("data", {}).get("max") or item.get("data", {}).get("480"),
            }
            for item in movie_data.get("results", [])
            if item.get("preview") or item.get("data", {}).get("max") or item.get("data", {}).get("480")
        ]
    except RawgClientError:
        media["trailers"] = []

    return media


def normalize_search_result(item):
    return {
        "rawg_id": item.get("id"),
        "name": item.get("name", ""),
        "slug": item.get("slug", ""),
        "background_image": item.get("background_image") or "",
        "released": item.get("released"),
        "platforms": [
            entry.get("platform", {}).get("name")
            for entry in item.get("platforms", [])
            if entry.get("platform", {}).get("name")
        ],
        "genres": [entry.get("name") for entry in item.get("genres", []) if entry.get("name")],
        "rawg_rating": item.get("rating"),
        "metacritic": item.get("metacritic"),
    }


def normalize_game_detail(item):
    result = normalize_search_result(item)
    result["description"] = item.get("description_raw") or item.get("description") or ""
    result["website"] = item.get("website") or ""
    result["developers"] = [entry.get("name") for entry in item.get("developers", []) if entry.get("name")]
    result["publishers"] = [entry.get("name") for entry in item.get("publishers", []) if entry.get("name")]
    result["stores"] = [
        {
            "name": entry.get("store", {}).get("name"),
            "domain": entry.get("store", {}).get("domain"),
            "url": entry.get("url") or "",
        }
        for entry in item.get("stores", [])
        if entry.get("store", {}).get("name")
    ]
    return result
