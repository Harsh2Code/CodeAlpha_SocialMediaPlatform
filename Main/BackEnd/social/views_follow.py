import logging
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Follow, CustomUser
from .serializers import FollowSerializer, UserSerializer

logger = logging.getLogger(__name__)

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def following(self, request):
        user = request.user
        following_users = CustomUser.objects.filter(followers__follower=user)
        serializer = UserSerializer(following_users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def followers(self, request):
        user = request.user
        follower_users = CustomUser.objects.filter(following__following=user)
        serializer = UserSerializer(follower_users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unfollow(self, request, pk=None):
        following_user = self.get_object().following
        follower_user = request.user
        follow = Follow.objects.filter(follower=follower_user, following=following_user)
        if not follow.exists():
            return Response({'detail': 'You are not following this user.'}, status=status.HTTP_400_BAD_REQUEST)
        follow.delete()
        return Response({'detail': 'User unfollowed.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='status', permission_classes=[permissions.IsAuthenticated])
    def get_follow_status(self, request, pk=None):
        logger.info(f"get_follow_status called with pk: {pk} (type: {type(pk)})")
        try:
            logger.info(f"Fetching follow status for user {pk} by user {request.user.id}")
            target_user = CustomUser.objects.get(pk=pk)
            logger.info(f"Found target user: {target_user.username}")
            is_following = Follow.objects.filter(follower=request.user, following=target_user).exists()
            logger.info(f"Follow status for user {pk}: {is_following}")
            return Response({'is_following': is_following}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            logger.warning(f"User {pk} not found when fetching follow status.")
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching follow status for user {pk}: {e}", exc_info=True)
            return Response({'detail': 'Error fetching follow status.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
