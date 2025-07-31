from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from social.views_custom_auth import CustomObtainAuthToken


urlpatterns = [
    path('api-token-auth/', CustomObtainAuthToken.as_view(), name='api_token_auth'),
    path('', lambda request: redirect('/api/posts/')),
    path('admin/', admin.site.urls),
    path('api/', include('social.urls')),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)