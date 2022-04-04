from app.models import *

def print_info():
    print(f'Number of users: {User.objects.count()}')
    print(f'Number of friend requests: {FriendRequest.objects.count()}')
    print(f'Number of books: {Book.objects.count()}')
    print(f'Number of book ratings: {BookRating.objects.count()}')
    print(f'Number of clubs: {Club.objects.count()}')
    print(f'Number of posts: {Post.objects.count()}')
    print(f'Number of comments: {Comment.objects.count()}')
    print(f'Number of replies: {Reply.objects.count()}')
    print(f'Number of meetings: {Meeting.objects.count()}')
    print(f'Number of time periods: {TimePeriod.objects.count()}')
    print(f'Number of chats: {Chat.objects.count()}')
    print(f'Number of messages: {Message.objects.count()}')