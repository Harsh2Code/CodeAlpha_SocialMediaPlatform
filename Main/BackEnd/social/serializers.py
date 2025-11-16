from rest_framework import serializers
from .models import CustomUser, Post, Like, Comment, Follow
from django.contrib.auth import authenticate
from rest_framework import exceptions
from django.core.files.base import ContentFile
import logging

logger = logging.getLogger(__name__)

class EmailAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField(label="Email")
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                email=email, password=password)
            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise exceptions.AuthenticationFailed(msg, 'authorization')
        else:
            msg = 'Must include "email" and "password".'
            raise exceptions.ValidationError(msg)

        attrs['user'] = user
        return attrs

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'profile_picture', 'bio', 'first_name', 'last_name', 'nationality', 'date_of_birth', 'gender')
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture)
            return obj.profile_picture
        return None

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'title', 'content', 'image', 'created_at', 'likes_count', 'comments_count')
        read_only_fields = ('author',)

    def get_author_profile_picture(self, obj):
        if obj.author.profile_picture:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.author.profile_picture)
            return obj.author.profile_picture
        return '/Profile-Photo.jpeg' # Default image if no profile picture

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'user', 'post', 'created_at')
        read_only_fields = ('user',)

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    user_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'user_name', 'user_profile_picture', 'post', 'content', 'created_at')
        read_only_fields = ('user',)

    def get_user_profile_picture(self, obj):
        if obj.user.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.profile_picture)
            return obj.user.profile_picture
        return '/Profile-Photo.jpeg'

class FollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.ReadOnlyField(source='follower.username')
    following_username = serializers.ReadOnlyField(source='following.username')

    class Meta:
        model = Follow
        fields = ('id', 'follower', 'follower_username', 'following', 'following_username', 'created_at')
        read_only_fields = ('follower',)
