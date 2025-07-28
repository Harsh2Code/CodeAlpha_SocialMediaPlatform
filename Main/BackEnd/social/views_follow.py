from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Follow
from .serializers import UserSerializer

User = get_user_model()

class FollowViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        try:
            user_to_follow = None
            try:
                user_to_follow = User.objects.get(pk=int(pk))
            except (ValueError, User.DoesNotExist):
                try:
                    user_to_follow = User.objects.get(username=pk.strip())
                except User.DoesNotExist:
                    try:
                        user_to_follow = User.objects.get(username__iexact=pk.strip())
                    except User.DoesNotExist:
                        try:
                            user_to_follow = User.objects.get(username__iexact=pk.strip().replace(" ", ""))
                        except User.DoesNotExist:
                            # Instead of 404, return error message for unknown user
                            return Response({'detail': 'User not found. Please register first.'}, status=status.HTTP_400_BAD_REQUEST)
            if user_to_follow == request.user:
                return Response({'detail': 'Cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
            follow_relation, created = Follow.objects.get_or_create(follower=request.user, following=user_to_follow)
            if created:
                return Response({'detail': 'Followed successfully.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'detail': 'Already following.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        try:
            user_to_unfollow = None
            try:
                user_to_unfollow = User.objects.get(pk=int(pk))
            except (ValueError, User.DoesNotExist):
                try:
                    user_to_unfollow = User.objects.get(username=pk.strip())
                except User.DoesNotExist:
                    try:
                        user_to_unfollow = User.objects.get(username__iexact=pk.strip())
                    except User.DoesNotExist:
                        try:
                            user_to_unfollow = User.objects.get(username__iexact=pk.strip().replace(" ", ""))
                        except User.DoesNotExist:
                            # Instead of 404, return error message for unknown user
                            return Response({'detail': 'User not found. Please register first.'}, status=status.HTTP_400_BAD_REQUEST)
            if user_to_unfollow == request.user:
                return Response({'detail': 'Cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
            deleted, _ = Follow.objects.filter(follower=request.user, following=user_to_unfollow).delete()
            if deleted:
                return Response({'detail': 'Unfollowed successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Not following.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        try:
            # pk is expected to be user id (int), but currently it may be username string
            # Try to get user by id, if fails, try by username
            user = None
            try:
                user = User.objects.get(pk=int(pk))
            except (ValueError, User.DoesNotExist):
                try:
                    user = User.objects.get(username=pk.strip())
                except User.DoesNotExist:
                    # Try to get user by exact match ignoring case and spaces
                    try:
                        user = User.objects.get(username__iexact=pk.strip())
                    except User.DoesNotExist:
                        # Try to get user by username with spaces removed
                        try:
                            user = User.objects.get(username__iexact=pk.strip().replace(" ", ""))
                        except User.DoesNotExist:
                            # Instead of 404, return is_following false for unknown user
                            return Response({'is_following': False}, status=status.HTTP_200_OK)
            is_following = Follow.objects.filter(follower=request.user, following=user).exists()
            return Response({'is_following': is_following}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def following(self, request):
        try:
            user = request.user
            following_users = [follow.following for follow in user.following_set.all()]
            serializer = UserSerializer(following_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def followers(self, request):
        try:
            user = request.user
            followers_users = [follow.follower for follow in user.followers_set.all()]
            serializer = UserSerializer(followers_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def user_followers(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            followers_users = user.followers_set.all()
            serializer = UserSerializer(followers_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def user_following(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            following_users = user.following.all()
            serializer = UserSerializer(following_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        user_to_unfollow = None
        try:
            user_to_unfollow = User.objects.get(pk=int(pk))
        except (ValueError, User.DoesNotExist):
            try:
                user_to_unfollow = User.objects.get(username=pk.strip())
            except User.DoesNotExist:
                try:
                    user_to_unfollow = User.objects.get(username__iexact=pk.strip())
                except User.DoesNotExist:
                    try:
                        user_to_unfollow = User.objects.get(username__iexact=pk.strip().replace(" ", ""))
                    except User.DoesNotExist:
                        # Instead of 404, return error message for unknown user
                        return Response({'detail': 'User not found. Please register first.'}, status=status.HTTP_400_BAD_REQUEST)
        if user_to_unfollow == request.user:
            return Response({'detail': 'Cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        deleted, _ = Follow.objects.filter(follower=request.user, following=user_to_unfollow).delete()
        if deleted:
            return Response({'detail': 'Unfollowed successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Not following.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        # pk is expected to be user id (int), but currently it may be username string
        # Try to get user by id, if fails, try by username
        user = None
        try:
            user = User.objects.get(pk=int(pk))
        except (ValueError, User.DoesNotExist):
            try:
                user = User.objects.get(username=pk.strip())
            except User.DoesNotExist:
                # Try to get user by exact match ignoring case and spaces
                try:
                    user = User.objects.get(username__iexact=pk.strip())
                except User.DoesNotExist:
                    # Try to get user by username with spaces removed
                    try:
                        user = User.objects.get(username__iexact=pk.strip().replace(" ", ""))
                    except User.DoesNotExist:
                        # Instead of 404, return is_following false for unknown user
                        return Response({'is_following': False}, status=status.HTTP_200_OK)
        is_following = Follow.objects.filter(follower=request.user, following=user).exists()
        return Response({'is_following': is_following}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def following(self, request):
        user = request.user
        following_users = [follow.following for follow in user.following_set.all()]
        serializer = UserSerializer(following_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def followers(self, request):
        user = request.user
        followers_users = [follow.follower for follow in user.followers_set.all()]
        serializer = UserSerializer(followers_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def user_followers(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            followers_users = user.followers_set.all()
            serializer = UserSerializer(followers_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def user_following(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            following_users = user.following.all()
            serializer = UserSerializer(following_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
