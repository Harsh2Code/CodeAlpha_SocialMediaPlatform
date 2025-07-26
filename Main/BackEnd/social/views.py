from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Post, Like, Comment
from .serializers import PostSerializer, LikeSerializer, CommentSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    # Exclude design reference images from the feed
    design_image_urls = [
        "http://localhost:8000/media/post_images/Cisco_logo_blue_2016_1pPb5b7.svg.png",
        "http://localhost:8000/media/post_images/Cisco_logo_blue_2016_4th9jts.svg.png",
        "http://localhost:8000/media/post_images/Cisco_logo_blue_2016_HN8C3Ux.svg.png",
        "http://localhost:8000/media/post_images/Cisco_logo_blue_2016_JWBSOqI.svg.png",
        "http://localhost:8000/media/post_images/Cisco_logo_blue_2016_OjMttNk.svg.png",
        "http://localhost:8000/media/post_images/Cisco_logo_blue_2016.svg.png",
    ]

    def get_queryset(self):
        return Post.objects.exclude(image_url__in=self.design_image_urls).order_by('-timestamp')

    def perform_create(self, serializer):
        # Attach authenticated user to post
        image_url = self.request.data.get('image_url')
        if image_url:
            serializer.save(user=self.request.user, image_url=image_url)
        else:
            serializer.save(user=self.request.user)

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-timestamp')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
