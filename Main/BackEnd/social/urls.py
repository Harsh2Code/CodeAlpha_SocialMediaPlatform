from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, LikeViewSet, CommentViewSet, UserViewSet
from .views_custom_auth import CustomObtainAuthToken, RegisterUser, PostsListTest
from .views_follow import FollowViewSet
from .views_home import HomePageAPIView

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'likes', LikeViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'users', UserViewSet, basename='user')
router.register(r'follows', FollowViewSet, basename='follow')

urlpatterns = [
    path('', HomePageAPIView.as_view(), name='home'),
    path('', include(router.urls)),
    
    path('register/', RegisterUser.as_view(), name='register'),
    path('postslisttest/', PostsListTest.as_view(), name='postslisttest'),
]
