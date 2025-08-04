from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Post, Like, Comment, Follow, CustomUser

# Register your models here.
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Follow)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'profile_picture')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('profile_picture', 'bio', 'nationality', 'date_of_birth', 'gender')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('profile_picture', 'bio', 'nationality', 'date_of_birth', 'gender')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)