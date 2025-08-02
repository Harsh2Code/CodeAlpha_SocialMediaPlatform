from rest_framework import serializers
from .models import CustomUser, Post, Like, Comment, Follow
from django.contrib.auth import authenticate
from rest_framework import exceptions
import requests
from django.core.files.base import ContentFile

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
    profile_picture_url = serializers.URLField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'profile_picture', 'bio', 'password')
        read_only_fields = ('profile_picture',)
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        profile_picture_url = validated_data.pop('profile_picture_url', None)
        if profile_picture_url:
            try:
                response = requests.get(profile_picture_url)
                response.raise_for_status()  # Raise an exception for HTTP errors
                file_name = profile_picture_url.split('/')[-1]
                instance.profile_picture.save(file_name, ContentFile(response.content))
            except requests.exceptions.RequestException as e:
                raise serializers.ValidationError(f"Could not download image from URL: {e}")

        return super().update(instance, validated_data)

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_username', 'content', 'image', 'created_at', 'likes_count', 'comments_count')
        read_only_fields = ('author',)

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
    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'content', 'created_at')
        read_only_fields = ('user',)

class FollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.ReadOnlyField(source='follower.username')
    following_username = serializers.ReadOnlyField(source='following.username')

    class Meta:
        model = Follow
        fields = ('id', 'follower', 'follower_username', 'following', 'following_username', 'created_at')
        read_only_fields = ('follower',)
