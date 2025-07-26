from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, LikeViewSet, CommentViewSet
from .views_custom_auth import CustomObtainAuthToken, RegisterUser, PostsListTest

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

router.register(r'likes', LikeViewSet)
router.register(r'comments', CommentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('api-token-auth/', CustomObtainAuthToken.as_view(), name='api_token_auth'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('postslisttest/', PostsListTest.as_view(), name='postslisttest'),
]
