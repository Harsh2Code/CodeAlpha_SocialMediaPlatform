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
        fields = ('id', 'username', 'email', 'profile_picture', 'bio', 'password', 'first_name', 'last_name', 'nationality', 'date_of_birth', 'gender')
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
    
    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

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

    def to_representation(self, instance):
        """
        Override to handle any issues with the image field during serialization.
        """
        try:
            data = super().to_representation(instance)
            # Ensure image field is properly handled
            if hasattr(instance, 'image') and instance.image:
                # If image is a file field, get its URL
                if hasattr(instance.image, 'url'):
                    data['image'] = instance.image.url
                # If image is already a URL string, keep it as is
                elif isinstance(instance.image, str):
                    data['image'] = instance.image
                # Handle any other cases
                else:
                    data['image'] = str(instance.image)
            return data
        except Exception as e:
            logger.error(f"Error serializing post {instance.id}: {str(e)}", exc_info=True)
            # Return a simplified representation if there's an error
            return {
                'id': instance.id,
                'author': instance.author.id if instance.author else None,
                'author_username': instance.author.username if instance.author else None,
                'content': instance.content,
                'image': None,
                'created_at': instance.created_at,
                'likes_count': 0,
                'comments_count': 0
            }

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
