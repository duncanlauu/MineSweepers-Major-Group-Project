from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import Club, Post, User
from django.db.models import Q

from app.serializers import PostSerializer


class FeedView(APIView):
    """API View of feed of user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get list of posts of friends and clubs"""
        user = request.user
        users = list(user.friends.all()) + [user]
        clubs = list(Club.objects.filter(Q(owner=user) | Q(admins=user) | Q(members=user)).all())
        posts = Post.objects.filter(Q(club__in=clubs) | Q(author__in=users)).values()
        return Response({'posts': posts}, status=status.HTTP_200_OK)


class AllPostsView(APIView):
    """API View of all posts of user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get list of posts of user"""
        user = request.user
        posts = user.posts.values()
        return Response({'posts': posts}, status=status.HTTP_200_OK)

    def post(self, request):
        """Create post"""
        user = request.user
        serializer = PostSerializer(data=request.data)
        serializer.data['author'] = user
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
    """API View of a post of a user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        """Get a post of a user"""
        try:
            user = request.user
            post = Post.objects.get(pk=post_id)
            users = list(user.friends.all()) + [user]
            clubs = list(Club.objects.filter(Q(owner=user) | Q(admins=user) | Q(members=user)).all())
            posts = Post.objects.filter(Q(club__in=clubs) | Q(author__in=users)).all()
            if post in posts:
                return Response({'post': post}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, post_id):
        """Update post"""
        try:
            user = request.user
            post = Post.objects.get(pk=post_id)
            if post.author == user:
                serializer = PostSerializer(post, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                if request.data['action'] == 'upvote':
                    post.upvote_post()
                elif request.data['action'] == 'downvote':
                    post.downvote_post()
                elif request.data['action'] == 'comment':
                    post.
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        pass