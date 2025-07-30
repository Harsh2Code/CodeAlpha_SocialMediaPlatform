from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Like, Comment
from .serializers import PostSerializer, LikeSerializer, CommentSerializer

class HomePageAPIView(APIView):
    def get(self, request):
        posts = Post.objects.all()
        likes = Like.objects.all()
        comments = Comment.objects.all()

        posts_data = PostSerializer(posts, many=True).data
        likes_data = LikeSerializer(likes, many=True).data
        comments_data = CommentSerializer(comments, many=True).data

        return Response({
            'posts': posts_data,
            'likes': likes_data,
            'comments': comments_data,
        }, status=status.HTTP_200_OK)
