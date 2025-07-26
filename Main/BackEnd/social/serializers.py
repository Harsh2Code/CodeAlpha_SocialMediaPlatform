from rest_framework import serializers
from .models import Post, Like, Comment

class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'visibility', 'image_url', 'image', 'timestamp']

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
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'timestamp']
