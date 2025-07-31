from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Follow, CustomUser
from .serializers import FollowSerializer, UserSerializer

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
