from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_update_profile_picture_url(self):
        url = f'/api/users/{self.user.id}/'
        data = {'profile_picture_url': 'https://example.com/image.jpg'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.profile_picture_url, data['profile_picture_url'])

    def test_get_user(self):
        url = f'/api/users/{self.user.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

class PostAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='postuser', email='post@example.com', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_posts(self):
        url = '/api/posts/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class FollowAPITests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='testpass123')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='testpass123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_follow_and_unfollow(self):
        follow_url = f'/api/follows/{self.user2.id}/follow/'
        unfollow_url = f'/api/follows/{self.user2.id}/unfollow/'

        # Follow user2
        response = self.client.post(follow_url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])

        # Unfollow user2
        response = self.client.post(unfollow_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_followers_and_following(self):
        followers_url = '/api/follows/followers/'
        following_url = '/api/follows/following/'

        response = self.client.get(followers_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(following_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
