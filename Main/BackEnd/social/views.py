from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Post, Like, Comment, CustomUser, Follow
from .serializers import PostSerializer, LikeSerializer, CommentSerializer, UserSerializer, FollowSerializer
import logging

logger = logging.getLogger(__name__)

from .permissions import IsOwnerOrReadOnly

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    @action(detail=False, methods=['get', 'patch'], url_path='me', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset()
        author_id = self.request.query_params.get('author_id')
        if author_id:
            queryset = queryset.filter(author__id=author_id)
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            logger.info("Fetching posts")
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error fetching posts: {str(e)}", exc_info=True)
            return Response({'detail': 'Error fetching posts'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if Like.objects.filter(post=post, user=user).exists():
            return Response({'detail': 'You have already liked this post.'}, status=status.HTTP_400_BAD_REQUEST)
        like = Like.objects.create(post=post, user=user)
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        post = self.get_object()
        user = request.user
        like = Like.objects.filter(post=post, user=user)
        if not like.exists():
            return Response({'detail': 'You have not liked this post.'}, status=status.HTTP_400_BAD_REQUEST)
        like.delete()
        return Response({'detail': 'Post unliked successfully.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comment(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def list_comments(self, request, pk=None):
        post = self.get_object()
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        post_pk = self.kwargs.get('post_pk')
        if post_pk:
            queryset = queryset.filter(post__pk=post_pk)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

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


