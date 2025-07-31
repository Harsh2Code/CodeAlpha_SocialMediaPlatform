from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.email = "testuser@example.com"
        self.password = "testpassword123"
        self.username = "testuser"
        self.user = CustomUser.objects.create_user(username=self.username, email=self.email, password=self.password)

    def test_login_success(self):
        url = reverse('api_token_auth')
        response = self.client.post(url, {'email': self.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_multiple_users_same_email(self):
        # Create another user with the same email to test multiple users scenario
        CustomUser.objects.create_user(username="testuser2", email=self.email, password="anotherpassword")
        url = reverse('api_token_auth')
        response = self.client.post(url, {'email': self.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

class UserEndpointTests(APITestCase):
    def setUp(self):
        self.email = "testuser2@example.com"
        self.password = "testpassword123"
        self.username = "testuser2"
        self.user = CustomUser.objects.create_user(username=self.username, email=self.email, password=self.password)
        url = reverse('api_token_auth')
        response = self.client.post(url, {'email': self.email, 'password': self.password}, format='json')
        self.token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

    def test_get_current_user(self):
        url = '/api/users/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], self.email)
