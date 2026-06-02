from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "service": "GameMemory API",
            "rawg_api_key_configured": bool(settings.RAWG_API_KEY),
        }
    )
