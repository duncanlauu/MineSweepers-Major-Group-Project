from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import Club, Post, Comment, Reply
from django.db.models import Q
from app.serializers import PostSerializer, CommentSerializer, ReplySerializer


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
            # check if the logged in user can view this post
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
                # elif request.data['action'] == 'comment':
                #     # TODO: Front end params needs to be discussed
                #     comment = CommentSerializer(data=request.data['comment']).save()
                #     post.add_comment(comment)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        post = Post.objects.get(pk=post_id)
        if post.author == request.user:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CommentView(APIView):
    """API View of comments from a post"""
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        """Get all comments from a post"""
        try:
            post = Post.objects.get(pk=post_id)
            comments = post.comment_set.all().values()
            return Response({'comments': comments}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, post_id):
        """Create a comment under a post"""
        try:
            post = Post.objects.get(pk=post_id)
            post_serializer = PostSerializer(post)
            request.data['post'] = post_serializer.data
            comment_serializer = CommentSerializer(data=request.data)
            if comment_serializer.is_valid():
                comment_serializer.save()
                return Response(comment_serializer.data, status=status.HTTP_201_CREATED)
            return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        pass

    def delete(self, request, comment_id):
        """Delete a comment from a post"""
        comment = Comment.objects.get(pk=comment_id)
        if comment.author == request.user:
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ModifyCommentView(APIView):
    """API View to modify a comments from a post"""
    def post(self, request, comment_id):
        try:
            comment = Comment.objects.get(pk=comment_id)
            if comment.author == request.user:
                serializer = CommentSerializer(comment, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                if request.data['action'] == 'upvote':
                    comment.upvote()
                elif request.data['action'] == 'downvote':
                    comment.downvote()
            serializer = CommentSerializer(comment, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ReplyView(APIView):
    """API View for a reply to a comment"""
    permission_classes = [IsAuthenticated]

    def get(self, request, comment_id):
        """Get all replies from a comment"""
        try:
            comment = Comment.objects.get(pk=comment_id)
            replies = comment.reply_set.all().values()
            return Response({'replies': replies}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, comment_id):
        """Add a reply to a comment"""
        try:
            comment = Comment.objects.get(pk=comment_id)
            comment_serializer = CommentSerializer(comment)
            request.data['comment'] = comment_serializer.data
            reply_serializer = ReplySerializer(data=request.data)
            if reply_serializer.is_valid():
                reply_serializer.save()
                return Response(reply_serializer.data, status=status.HTTP_201_CREATED)
            return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, reply_id):
        """Delete a reply from a comment"""
        reply = Reply.objects.get(pk=reply_id)
        if reply.author == request.user:
            reply.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class ModifyReplyView(APIView):
    """API View to modify a reply to a comment from a post"""
    permission_classes = [IsAuthenticated]

    def post(self, request, reply_id):
        try:
            reply = Reply.objects.get(pk=reply_id)
            if reply.author == request.user:
                serializer = ReplySerializer(Reply, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                if request.data['action'] == 'upvote':
                    reply.upvote()
                elif request.data['action'] == 'downvote':
                    reply.downvote()
            serializer = CommentSerializer(reply, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)