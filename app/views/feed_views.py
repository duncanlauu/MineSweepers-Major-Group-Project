from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import Club, Post, Comment, Reply
from django.db.models import Q
from app.serializers import PostSerializer, CommentSerializer, ReplySerializer
from app.helpers import is_post_visible_to_user


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
        data = request.data.copy()
        data['author'] = user.id
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
    """API View of a post of a user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        """Get a post visible to user"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            serializer = PostSerializer(post)
            if is_post_visible_to_user(user, post):
                return Response({'post': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, post_id):
        """Update post"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            if request.data['action'] == 'edit' and post.author == user:
                serializer = PostSerializer(post, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            if is_post_visible_to_user(user, post):
                if request.data['action'] == 'upvote':
                    post.upvote_post(user)
                    return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        post = Post.objects.get(id=post_id)
        if post.author == request.user:
            post.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AllCommentsView(APIView):
    """API View of all comments from a post by the user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        """Get all comments from a post by the user"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            if is_post_visible_to_user(user, post):
                comments = post.comment_set.values()
                return Response({'comments': comments}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, post_id):
        """Create a comment under a post"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            if not is_post_visible_to_user(user, post):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            post = Post.objects.get(id=post_id)
            data = request.data.copy()
            data['author'] = user.id
            data['post'] = post.id
            comment_serializer = CommentSerializer(data=data)
            if comment_serializer.is_valid():
                comment_serializer.save()
                return Response(comment_serializer.data, status=status.HTTP_201_CREATED)
            return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CommentView(APIView):
    """API View of a comment of a user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, comment_id):
        """Get a comment visible to a user"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            comment = Comment.objects.get(id=comment_id)
            serializer = CommentSerializer(comment)
            if is_post_visible_to_user(user, post) and comment.post == post:
                return Response({'comment': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, post_id, comment_id):
        """Update comment"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            comment = Comment.objects.get(id=comment_id)
            if request.data['action'] == 'edit' and comment.author == request.user:
                serializer = CommentSerializer(comment, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            if is_post_visible_to_user(user, post) and comment.post == post:
                if request.data['action'] == 'upvote':
                    comment.upvote(user)
                    return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id, comment_id):
        """Delete a comment from a post either if you are the author of the comment or the post it is in"""
        user = request.user
        comment = Comment.objects.get(id=comment_id)
        post = Post.objects.get(id=post_id)
        if comment.author == user or post.author == user:
            comment.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AllRepliesView(APIView):
    """API View for all replies to a comment"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, comment_id):
        """Get all replies from a comment"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            if is_post_visible_to_user(user, post):
                comment = Comment.objects.get(id=comment_id)
                replies = comment.reply_set.values()
            return Response({'replies': replies}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, post_id, comment_id):
        """Add a reply to a comment under a post visible to user"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            if not is_post_visible_to_user(user, post):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            comment = Comment.objects.get(id=comment_id)
            data = request.data.copy()
            data['author'] = user.id
            data['comment'] = comment.id
            reply_serializer = ReplySerializer(data=data)
            if reply_serializer.is_valid():
                reply_serializer.save()
                return Response(reply_serializer.data, status=status.HTTP_201_CREATED)
            return Response(reply_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ReplyView(APIView):
    """API View to a reply to a comment from a post"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, comment_id, reply_id):
        """Get a reply visible to a user"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            comment = Comment.objects.get(id=comment_id)
            reply = Reply.objects.get(id=reply_id)
            serializer = ReplySerializer(reply)
            if is_post_visible_to_user(user, post) and comment.post == post and reply.comment == comment:
                return Response({'reply': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, post_id, comment_id, reply_id):
        """Update reply"""
        try:
            user = request.user
            post = Post.objects.get(id=post_id)
            comment = Comment.objects.get(id=comment_id)
            reply = Reply.objects.get(id=reply_id)
            if request.data['action'] == 'edit' and reply.author == request.user:
                reply_serializer = ReplySerializer(reply, data=request.data, partial=True)
                if reply_serializer.is_valid():
                    reply_serializer.save()
                    return Response(reply_serializer.data, status=status.HTTP_200_OK)
                return Response(reply_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            if is_post_visible_to_user(user, post) and comment.post == post and reply.comment == comment:
                if request.data['action'] == 'upvote':
                    reply.upvote(user)
                    return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Reply.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id, comment_id, reply_id):
        """Delete a reply from a comment either if you are the author of the reply or the post it is in"""
        user = request.user
        post = Post.objects.get(id=post_id)
        reply = Reply.objects.get(id=reply_id)
        if reply.author == user or post.author == user:
            reply.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)