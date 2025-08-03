from social.models import CustomUser

try:
    user = CustomUser.objects.get(id=2)
    print(f"User with ID 2 already exists: {user.username}")
except CustomUser.DoesNotExist:
    user = CustomUser.objects.create_user(
        username='user2',
        email='user2@example.com',
        password='password123',
        id=2
    )
    print(f"Created user with ID 2: {user.username}")

# Set a placeholder profile picture URL
user.profile_picture = 'https://example.com/default_profile_pic.jpg'
user.save()
print(f"Set profile picture for user {user.username} to {user.profile_picture}")
