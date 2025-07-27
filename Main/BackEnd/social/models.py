from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    nationality = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    profile_picture_url = models.URLField(max_length=500, blank=True, null=True)

    @property
    def following(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.filter(followers_set__follower=self)

class Post(models.Model):
    VISIBILITY_CHOICES = [
        ('Public', 'Public'),
        ('Friends', 'Friends'),
        ('Only Me', 'Only Me'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='Public')
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Follow(models.Model):
    follower = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='following_set')
    following = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='followers_set')
