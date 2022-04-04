from django.db.models import Q
from app.models import Club, Post, User, Chat
from django.shortcuts import get_object_or_404


def is_post_visible_to_user(user, post):
    """Returns true when post is visible to user, i.e. by their friends, themselves, or their club"""
    users = list(user.friends.all()) + [user]
    clubs = list(Club.objects.filter(Q(owner=user) | Q(admins=user) | Q(members=user)).all())
    posts = Post.objects.filter(Q(club__in=clubs) | Q(author__in=users)).all()
    return post in posts


# Chat Helpers
def get_all_messages(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    return chat.messages.order_by('-timestamp').all()


def get_last_message(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    last_message_list = chat.messages.order_by('-timestamp').all()[:1]
    if len(last_message_list) < 1:
        return None
    else:
        return last_message_list[0]


def get_current_chat(chat_id):
    return get_object_or_404(Chat, id=chat_id)


def get_user(username):
    user = get_object_or_404(User, username=username)
    return user
