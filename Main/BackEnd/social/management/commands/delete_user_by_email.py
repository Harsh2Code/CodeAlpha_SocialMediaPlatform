from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Delete a user by email'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the user to delete')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            user.delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted user with email: {email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User with email {email} does not exist'))
