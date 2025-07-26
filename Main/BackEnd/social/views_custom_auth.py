from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .authentication import EmailBackend
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Post
from .serializers import PostSerializer

User = get_user_model()

class CustomObtainAuthToken(APIView):
    #Custom view to obtain auth token using email and password.

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        if email is None or password is None:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)
        # Map email to username for authentication backend
        username = email
        user = EmailBackend().authenticate(request, username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

class RegisterUser(APIView):
    """
    API view to register a new user.
    """
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        date_of_birth = request.data.get('date_of_birth')
        gender = request.data.get('gender')
        if not username or not email or not password:
            return Response({'error': 'Username, email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User(
            username=username,
            email=email,
            date_of_birth=date_of_birth,
            gender=gender,
            password=make_password(password)
        )
        user.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

class PostsListTest(APIView):
    """
    Test API view to return serialized posts.
    """
    def get(self, request, *args, **kwargs):
        posts = Post.objects.all().order_by('-timestamp')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
