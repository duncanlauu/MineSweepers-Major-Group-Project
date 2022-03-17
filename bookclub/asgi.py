"""
ASGI config for bookclub project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os, django

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.routing import get_default_application
from django.core.asgi import get_asgi_application
import app.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookclub.settings')

# Messaging implementation from: https://channels.readthedocs.io tutorial
# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             app.routing.websocket_urlpatterns
#         )
#     ),
#     # Just HTTP for now. (We can add other protocols later.)
# })

django.setup()
application = get_default_application()
