from django.contrib import admin
from app.models import User, Club, Book, Chat, Message, FriendRequest, Post, Meeting


# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Configuration of the admin interface for users."""

    list_display = [
        'username', 'first_name', 'last_name', 'email', 'location', 'id'
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

admin.site.register(Chat)
admin.site.register(Message)


@admin.register(FriendRequest)
class FriendRequest(admin.ModelAdmin):
    list_display = [
        'sender', 'receiver', 'created_at'
    ]

@admin.register(Post)
class Post(admin.ModelAdmin):
    list_display = [
        "title", "content", "created_at"
    ]
@admin.register(Meeting)
class Meeting(admin.ModelAdmin):
    list_display = [
        "name", "club", "book", "time"
    ]
    
