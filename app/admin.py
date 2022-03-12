from django.contrib import admin
from app.models import User, Club, Book, FriendRequest

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Configuration of the admin interface for users."""

    list_display = [
        'username', 'first_name', 'last_name', 'email', 'location'
    ]

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    """Configuration of the admin interface for users."""

    list_display = [
        'name', 'description', 'visibility', 'public'
    ]


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    """Configuration of the admin interface for users."""

    list_display = [
        'ISBN', 'title', 'author', 'publisher'
    ]

@admin.register(FriendRequest)
class FriendRequest(admin.ModelAdmin):
    list_display = [
        'sender', 'receiver', 'created_at'
    ]
