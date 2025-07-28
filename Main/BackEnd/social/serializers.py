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
        from rest_framework.exceptions import ValidationError
        image = data.get('image')
        image_url = data.get('image_url')

        if image and image_url:
            raise ValidationError("Please provide either an uploaded image or a URL—not both.")
        return data

    def create(self, validated_data):
        try:
            return Post.objects.create(**validated_data)
        except Exception as e:
            print(f"Error creating Post instance: {e}")
            raise e

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
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'date_of_birth', 'gender', 'nationality', 'profile_picture_url', 'profile_picture', 'following']

    def get_following(self, obj):
        following_users = obj.following.all()
        return [{'id': user.id, 'username': user.username} for user in following_users]

    def update(self, instance, validated_data):
        from rest_framework.exceptions import ValidationError
        # Update profile_picture_url if it's in the validated data
        if 'profile_picture_url' in validated_data:
            print(f"Received profile_picture_url: {validated_data['profile_picture_url']}")
            instance.profile_picture_url = validated_data.pop('profile_picture_url')

        # Update profile_picture if it's in the validated data
        if 'profile_picture' in validated_data:
            print(f"Received profile_picture: {validated_data['profile_picture']}")
            instance.profile_picture = validated_data.pop('profile_picture')
        
        # Call the superclass's update method to handle other fields
        try:
            instance = super().update(instance, validated_data)
            instance.save()
            print("Instance saved successfully.")
        except ValidationError as ve:
            print(f"Validation error saving instance: {ve.detail}")
            raise ve
        except Exception as e:
            print(f"Error saving instance: {e}")
            raise  # Re-raise the exception after logging
        return instance
