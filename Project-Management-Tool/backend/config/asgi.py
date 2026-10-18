import os

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'config.settings'
)

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter

django_application = get_asgi_application()

from notifications.routing import websocket_urlpatterns
from notifications.middleware import JWTAuthMiddleware


application = ProtocolTypeRouter({
    "http": django_application,

    "websocket": JWTAuthMiddleware(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})