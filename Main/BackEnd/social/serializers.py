from rest_framework import serializers
from .models import Post, Like, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(required=False, allow_null=True)
    user = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'visibility', 'image_url', 'image', 'timestamp', 'likes_count', 'comments']

    def get_user(self, obj):
        if obj.user:
            return obj.user.username
        return "Anonymous"

    def get_likes_count(self, obj):
        return obj.like_set.count()

    def get_comments(self, obj):
        comments = obj.comment_set.all().order_by('timestamp')
        return CommentSerializer(comments, many=True).data

    def validate(self, data):
        image = data.get('image')
        image_url = data.get('image_url')

        if image and image_url:
            raise serializers.ValidationError("Please provide either an uploaded image or a URL—not both.")
        return data

    def create(self, validated_data):
        return Post.objects.create(**validated_data)

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'post', 'text', 'timestamp']

    def get_user_name(self, obj):
        return obj.user.username if obj.user else None

class UserSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'date_of_birth', 'gender', 'nationality', 'profile_picture_url', 'following']

    def get_following(self, obj):
        following_users = obj.following.all()
        return [{'id': user.id, 'username': user.username} for user in following_users]
