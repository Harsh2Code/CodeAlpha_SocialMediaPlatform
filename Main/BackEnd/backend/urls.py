from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework.authtoken.views import obtain_auth_token


from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('social.urls')),
    path('api/api-token-auth/', obtain_auth_token, name='api_token_auth_root'),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)