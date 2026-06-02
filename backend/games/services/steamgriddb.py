from urllib.parse import quote

import requests
from django.conf import settings
from rest_framework.exceptions import APIException


STEAMGRIDDB_BASE_URL = "https://www.steamgriddb.com/api/v2"


class SteamGridDBConfigurationError(APIException):
    status_code = 503
    default_detail = "SteamGridDB API key is not configured on the backend."


class SteamGridDBClientError(APIException):
    status_code = 502
    default_detail = "SteamGridDB API request failed. Please try again later."


def _request(path, params=None):
    if not settings.STEAMGRIDDB_API_KEY:
        raise SteamGridDBConfigurationError()

    headers = {"Authorization": f"Bearer {settings.STEAMGRIDDB_API_KEY}"}

    try:
        response = requests.get(
            f"{STEAMGRIDDB_BASE_URL}{path}",
            headers=headers,
            params=params,
            timeout=12,
        )
        response.raise_for_status()
    except requests.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else "unknown"
        raise SteamGridDBClientError(f"SteamGridDB returned HTTP {status_code}.") from exc
    except requests.RequestException as exc:
        raise SteamGridDBClientError() from exc

    return response.json()


def fetch_artwork_for_game(game_name):
    search_results = _request(f"/search/autocomplete/{quote(game_name)}").get("data", [])
    if not search_results:
        return {"steamgriddb_id": None, "assets": empty_assets()}

    match = choose_match(game_name, search_results)
    steamgriddb_id = match["id"]

    return {
        "steamgriddb_id": steamgriddb_id,
        "assets": {
            "poster": first_asset(f"/grids/game/{steamgriddb_id}", {"dimensions": "600x900"}),
            "hero": first_asset(f"/heroes/game/{steamgriddb_id}"),
            "logo": first_asset(f"/logos/game/{steamgriddb_id}"),
        },
    }


def choose_match(game_name, results):
    normalized_name = game_name.strip().lower()
    exact = next((item for item in results if item.get("name", "").strip().lower() == normalized_name), None)
    if exact:
        return exact
    verified = next((item for item in results if item.get("verified")), None)
    return verified or results[0]


def first_asset(path, params=None):
    data = _request(path, params).get("data", [])
    clean = [
        normalize_asset(item)
        for item in data
        if item.get("url") and not item.get("nsfw") and not item.get("humor")
    ]
    official = next((item for item in clean if item.get("style") == "official"), None)
    return official or (clean[0] if clean else None)


def normalize_asset(item):
    return {
        "id": item.get("id"),
        "url": item.get("url"),
        "thumb": item.get("thumb"),
        "style": item.get("style"),
        "width": item.get("width"),
        "height": item.get("height"),
    }


def empty_assets():
    return {
        "poster": None,
        "hero": None,
        "logo": None,
    }
