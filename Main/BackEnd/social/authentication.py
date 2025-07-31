from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailBackend(ModelBackend):
    """
    Custom authentication backend to authenticate users using their email address.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None or password is None:
            return None
        users = UserModel.objects.filter(email=email)
        if not users.exists():
            return None
        user = users.first()
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
