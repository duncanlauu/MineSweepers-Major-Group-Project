from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from app.models import Club, Post, User, Comment, Reply
from django.forms.models import model_to_dict


class FeedAPIViewTestCase(APITestCase):
    """Tests of the Feed related API views."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_post.json',
                'app/tests/fixtures/other_posts.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/other_clubs.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/default_comment.json',
                'app/tests/fixtures/other_comments.json',
                'app/tests/fixtures/default_reply.json',
                'app/tests/fixtures/other_replies.json'
                ]

    def _log_in_helper(self, username, password):
        login_data = {
            "username": username,
            "password": password,
        }
        login_url = "/api/token/"
        response = self.client.post(login_url, login_data, format="json")
        self.assertEqual(response.status_code, 200)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.other_user = User.objects.get(pk=2)
        self.non_friend_user = User.objects.get(pk=6)
        self.post = Post.objects.get(pk=1)

    # ---------- FEED ---------- #
    def test_get_feed(self):
        """Test user can see posts by themselves, friends, and clubs they are in"""
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(reverse('app:feed'))
        self.assertEqual(response.status_code, 200)
        posts = response.data['posts']
        post_ids = [post['id'] for post in posts]
        # Check own posts
        self.assertIn(1, post_ids)
        # Check friend posts
        self.assertIn(2, post_ids)
        # Check posts by non friends who are in the same club
        self.assertIn(3, post_ids)
        # Check posts by non friends who are in a club user is not a member of is not visible to user
        self.assertNotIn(4, post_ids)
        # Check additional liked flag if current logged in user liked the post
        for post in posts:
            post_object = Post.objects.get(id=post['id'])
            if self.user in post_object.upvotes.all():
                self.assertEqual(post['liked'], True)
            else:
                self.assertEqual(post['liked'], False)
            # Check likes count
            self.assertEqual(post_object.upvotes.count(), post['likesCount'])

    def test_get_other_user_feed_as_friend(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(
            reverse('app:other_user_posts', kwargs={'other_user_id': 2}))
        self.assertEqual(response.status_code, 200)
        posts = response.data['posts']
        for post in posts:
            self.assertIsNone(post['club'])
            self.assertIn('author__username', post)
            self.assertIn('author__email', post)

    def test_get_other_user_feed_as_non_friend(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(
            reverse('app:other_user_posts', kwargs={'other_user_id': 5}))
        self.assertEqual(response.status_code, 400)
        self.assertIsNone(response.data)

    # ---------- POST ---------- #
    def test_get_all_posts_of_user(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(reverse('app:all_posts'))
        self.assertEqual(response.status_code, 200)
        posts = response.data['posts']
        for post in posts:
            self.assertEqual(post['author'], self.user.id)
        self.assertEqual(len(posts), self.user.posts.count())
        # Check additional liked flag if current logged in user liked the post
        for post in posts:
            post_object = Post.objects.get(id=post['id'])
            if self.user in post_object.upvotes.all():
                self.assertEqual(post['liked'], True)
            else:
                self.assertEqual(post['liked'], False)
            # Check likes count
            self.assertEqual(post_object.upvotes.count(), post['likesCount'])

    def test_create_post_without_optional_fields(self):
        """Test user can create basic post without the optional fields"""
        self._log_in_helper(self.user.username, "Password123")
        title = 'test post title'
        form_data = {'title': title, 'content': 'test post content'}
        post_count_before = Post.objects.count()
        response = self.client.post(reverse('app:all_posts'), form_data)
        self.assertEqual(response.status_code, 201)
        post_count_after = Post.objects.count()
        # Check post created
        self.assertEqual(post_count_before + 1, post_count_after)
        # Check author is user
        post = Post.objects.get(title=title)
        self.assertEqual(post.author, self.user)

    def test_create_post_invalid(self):
        self._log_in_helper(self.user.username, "Password123")
        form_data = {'title': "", 'content': 'test post content'}
        post_count_before = Post.objects.count()
        response = self.client.post(reverse('app:all_posts'), form_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        post_count_after = Post.objects.count()
        self.assertEqual(post_count_before, post_count_after)

    def test_create_club_post(self):
        self._log_in_helper(self.user.username, "Password123")
        title = 'test full post title'
        content = 'test post content'
        club_id = 1
        form_data = {'title': title, 'content': content, 'club': club_id}
        post_count_before = Post.objects.count()
        response = self.client.post(reverse('app:all_posts'), form_data)
        self.assertEqual(response.status_code, 201)
        post_count_after = Post.objects.count()
        # Check post created
        self.assertEqual(post_count_before + 1, post_count_after)
        # Check author is user
        post = Post.objects.get(title=title)
        self.assertEqual(post.author, self.user)
        # Check other fields
        self.assertEqual(post.content, content)
        self.assertEqual(post.club.id, club_id)

    def test_create_personal_post_with_empty_club_id(self):
        self._log_in_helper(self.user.username, "Password123")
        title = 'test full post title'
        content = 'test post content'
        form_data = {'title': title, 'content': content, 'club_id': ''}
        post_count_before = Post.objects.count()
        response = self.client.post(reverse('app:all_posts'), form_data)
        self.assertEqual(response.status_code, 201)
        post_count_after = Post.objects.count()
        # Check post created
        self.assertEqual(post_count_before + 1, post_count_after)
        # Check author is user
        post = Post.objects.get(title=title)
        self.assertEqual(post.author, self.user)
        # Check other fields
        self.assertEqual(post.content, content)

    def test_get_post(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(reverse('app:post', kwargs={'post_id': 1}))
        self.assertEqual(response.status_code, 200)
        post = Post.objects.get(id=1)
        post_values = model_to_dict(post, fields=(
            [field.name for field in post._meta.fields]))
        for k, v in post_values.items():
            self.assertEqual(response.data['post'][k], v)
        if self.user in post.upvotes.all():
            self.assertTrue(response.data['post']['liked'])
        else:
            self.assertFalse(response.data['post']['liked'])
        actual_modified_upvotes = []
        for user in post.upvotes.all():
            actual_modified_upvotes.append(
                {"id": user.pk,
                 "username": user.username,
                 "email": user.email
                 }
            )
        self.assertListEqual(actual_modified_upvotes,
                            response.data['post']['upvotes'])

    def test_full_edit_post_by_author(self):
        self._log_in_helper(self.user.username, "Password123")
        new_title = 'new post title'
        new_content = 'new post content'
        new_post_data = {'title': new_title,
                         'content': new_content, 'action': 'edit'}
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 1}), new_post_data)
        self.assertEqual(response.status_code, 200)
        edited_post = Post.objects.get(id=1)
        self.assertEqual(edited_post.title, new_title)
        self.assertEqual(edited_post.content, new_content)

    def test_partial_edit_post_by_author(self):
        self._log_in_helper(self.user.username, "Password123")
        new_title = 'new post title'
        new_content = 'new post content'
        new_post_data = {'title': new_title,
                         'content': new_content, 'action': 'edit'}
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 1}), new_post_data)
        self.assertEqual(response.status_code, 200)
        edited_post = Post.objects.get(id=1)
        self.assertEqual(edited_post.title, new_title)
        self.assertEqual(edited_post.content, new_content)

    def test_edit_post_not_by_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        original_post = Post.objects.get(id=1)
        original_title = original_post.title
        original_content = original_post.content
        new_title = 'new post title'
        new_content = 'new post content'
        new_post_data = {'title': new_title,
                         'content': new_content, 'action': 'edit'}
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 1}), new_post_data)
        self.assertEqual(response.status_code, 400)
        edited_post = Post.objects.get(id=1)
        self.assertEqual(edited_post.title, original_title)
        self.assertEqual(edited_post.content, original_content)

    def test_upvote_post_by_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        upvote_before = Post.objects.get(id=2).upvotes.count()
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 2}), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Post.objects.get(id=2).upvotes.count()
        self.assertEqual(upvote_before + 1, upvote_after)

    def test_cancel_upvote_post_by_author(self):
        self._log_in_helper(self.user.username, "Password123")
        upvote_before = Post.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 1}), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Post.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before - 1, upvote_after)

    def test_upvote_post_by_authorized_user(self):
        self._log_in_helper(self.other_user.username, "Password123")
        upvote_before = Post.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 1}), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Post.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before + 1, upvote_after)

    def test_upvote_post_by_unauthorized_user(self):
        self._log_in_helper(self.non_friend_user.username, "Password123")
        upvote_before = Post.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:post', kwargs={'post_id': 1}), {"action": "upvote"})
        self.assertEqual(response.status_code, 400)
        upvote_after = Post.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before, upvote_after)

    def test_delete_post_by_author(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.delete(
            reverse('app:post', kwargs={'post_id': 1}))
        self.assertEqual(response.status_code, 200)
        with self.assertRaises(Post.DoesNotExist):
            Post.objects.get(pk=1)

    def test_delete_post_not_by_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        original_post = Post.objects.get(pk=1)
        response = self.client.delete(
            reverse('app:post', kwargs={'post_id': 1}))
        self.assertEqual(response.status_code, 400)
        post = Post.objects.get(pk=1)
        self.assertEqual(original_post, post)

    # ---------- COMMENT ---------- #
    def test_get_all_comment_from_visible_post(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(
            reverse('app:all_comments', kwargs={'post_id': 1}))
        self.assertEqual(response.status_code, 200)
        comments = response.data['comments']
        self.assertEqual(3, len(comments))
        # Check additional liked flag if current logged in user liked the post
        for comment in comments:
            comment_object = Comment.objects.get(id=comment['id'])
            if self.user in comment_object.upvotes.all():
                self.assertEqual(comment['liked'], True)
            else:
                self.assertEqual(comment['liked'], False)
            # Check likes count
            self.assertEqual(comment_object.upvotes.count(), comment['likesCount'])


    def test_get_comment_from_invisible_post(self):
        self._log_in_helper(self.non_friend_user.username, "Password123")
        response = self.client.get(
            reverse('app:all_comments', kwargs={'post_id': 1}))
        self.assertEqual(response.status_code, 400)

    def test_get_comment_with_invalid_post_id(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(
            reverse('app:all_comments', kwargs={'post_id': 1000}))
        self.assertEqual(response.status_code, 400)

    def test_add_comment(self):
        user = User.objects.get(pk=3)
        self._log_in_helper(user.username, "Password123")
        post_data = {'content': 'test'}
        comment_count_before = self.post.comment_set.count()
        self.assertFalse(Comment.objects.filter(
            post_id=1, author=user).exists())
        response = self.client.post(
            reverse('app:all_comments', kwargs={'post_id': 1}), data=post_data)
        comment_count_after = Post.objects.get(pk=1).comment_set.count()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(comment_count_before + 1, comment_count_after)
        self.assertTrue(Comment.objects.filter(
            post_id=1, author=user).exists())

    def test_get_single_comment_from_post(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        response = self.client.get(reverse('app:comment', kwargs=args))
        self.assertEqual(response.status_code, 200)
        comment = response.data['comment']
        actual_comment = Comment.objects.get(id=1)
        self.assertEqual(comment['author'], self.user.id)
        self.assertEqual(comment['post'], 1)
        self.assertEqual(comment['content'], 'This is a test comment.')
        actual_modified_upvotes = []
        for user in actual_comment.upvotes.all():
            actual_modified_upvotes.append(
                {"id": user.pk,
                 "username": user.username,
                 "email": user.email
                 }
            )
        self.assertListEqual(actual_modified_upvotes,
                            response.data['comment']['upvotes'])

    def test_edit_comment_from_post(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        comment_data = {'content': 'new test content', 'action': 'edit'}
        response = self.client.put(
            reverse('app:comment', kwargs=args), data=comment_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['content'], 'new test content')

    def test_upvote_comment_by_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 2}
        upvote_before = Comment.objects.get(id=2).upvotes.count()
        response = self.client.put(
            reverse('app:comment', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Comment.objects.get(id=2).upvotes.count()
        self.assertEqual(upvote_before + 1, upvote_after)

    def test_upvote_comment_by_authorized_user(self):
        user = User.objects.get(pk=3)
        self._log_in_helper(user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        upvote_before = Comment.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:comment', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Comment.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before + 1, upvote_after)

    def test_cancel_upvote_comment(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        upvote_before = Comment.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:comment', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Comment.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before - 1, upvote_after)

    def test_upvote_comment_by_unauthorized_user(self):
        user = User.objects.get(pk=5)
        self._log_in_helper(user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        upvote_before = Comment.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:comment', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 400)
        upvote_after = Comment.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before, upvote_after)

    def test_delete_comment_as_comment_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 2}
        self.assertTrue(Comment.objects.filter(pk=2).exists())
        response = self.client.delete(reverse('app:comment', kwargs=args))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Comment.objects.filter(pk=2).exists())

    def test_delete_author_comment_as_post_author(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        self.assertTrue(Comment.objects.filter(pk=1).exists())
        response = self.client.delete(reverse('app:comment', kwargs=args))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Comment.objects.filter(pk=1).exists())

    def test_delete_other_user_comment_as_post_author(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 2}
        self.assertTrue(Comment.objects.filter(pk=2).exists())
        response = self.client.delete(reverse('app:comment', kwargs=args))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Comment.objects.filter(pk=2).exists())

    def test_delete_comment_as_a_non_author(self):
        user = User.objects.get(pk=3)
        self._log_in_helper(user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 2}
        self.assertTrue(Comment.objects.filter(pk=2).exists())
        response = self.client.delete(reverse('app:comment', kwargs=args))
        self.assertEqual(response.status_code, 400)
        self.assertTrue(Comment.objects.filter(pk=2).exists())

    # ---------- REPLY ---------- #
    def test_get_all_replies_from_comment(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1}
        response = self.client.get(reverse('app:all_replies', kwargs=args))
        self.assertEqual(response.status_code, 200)
        replies = response.data['replies']
        reply_count = Reply.objects.filter(comment_id=1).count()
        self.assertEqual(reply_count, len(replies))
        # Check for author ids in returned data
        reply_author_ids = [author['id'] for author in replies]
        self.assertIn(1, reply_author_ids)
        self.assertIn(2, reply_author_ids)
        # Check additional liked flag if current logged in user liked the post
        for reply in replies:
            reply_object = Reply.objects.get(id=reply['id'])
            if self.user in reply_object.upvotes.all():
                self.assertEqual(reply['liked'], True)
            else:
                self.assertEqual(reply['liked'], False)
            # Check likes count
            self.assertEqual(reply_object.upvotes.count(), reply['likesCount'])


    def test_add_reply_to_comment(self):
        self._log_in_helper(self.user.username, "Password123")
        comment_data = {'content': 'test reply'}
        args = {'post_id': 1, 'comment_id': 1}
        reply_count_before = Comment.objects.get(pk=1).reply_set.count()
        response = self.client.post(
            reverse('app:all_replies', kwargs=args), comment_data)
        reply_count_after = Comment.objects.get(pk=1).reply_set.count()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(reply_count_before + 1, reply_count_after)
        new_reply = Reply.objects.get(pk=response.data['id'])
        self.assertEqual(new_reply.content, 'test reply')
        self.assertEqual(new_reply.author_id, response.data['author'])

    def test_get_single_reply_from_a_comment(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        response = self.client.get(reverse('app:reply', kwargs=args))
        self.assertEqual(response.status_code, 200)
        actual_reply = Reply.objects.get(pk=1)
        returned_reply = response.data['reply']
        self.assertEqual(actual_reply.id, returned_reply['id'])
        self.assertEqual(actual_reply.content, returned_reply['content'])
        self.assertEqual(actual_reply.author_id, returned_reply['author'])
        actual_modified_upvotes = []
        for user in actual_reply.upvotes.all():
            actual_modified_upvotes.append(
                {"id": user.pk,
                 "username": user.username,
                 "email": user.email
                 }
            )
        self.assertListEqual(actual_modified_upvotes,
                            response.data['reply']['upvotes'])

    def test_upvote_reply_by_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 2}
        upvote_before = Reply.objects.get(id=2).upvotes.count()
        response = self.client.put(
            reverse('app:reply', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Reply.objects.get(id=2).upvotes.count()
        self.assertEqual(upvote_before + 1, upvote_after)

    def test_cancel_upvote_reply(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        upvote_before = Reply.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:reply', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Reply.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before - 1, upvote_after)

    def test_upvote_reply_by_authorized_user(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        upvote_before = Reply.objects.get(id=1).upvotes.count()
        response = self.client.put(
            reverse('app:reply', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 200)
        upvote_after = Reply.objects.get(id=1).upvotes.count()
        self.assertEqual(upvote_before + 1, upvote_after)

    def test_upvote_reply_by_unauthorized_user(self):
        self._log_in_helper(self.non_friend_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        upvote_before = Reply.objects.get(id=1).upvotes
        response = self.client.put(
            reverse('app:reply', kwargs=args), {"action": "upvote"})
        self.assertEqual(response.status_code, 400)
        upvote_after = Reply.objects.get(id=1).upvotes
        self.assertEqual(upvote_before, upvote_after)

    def test_edit_reply_as_author(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        reply_data = {'content': 'new test reply content', 'action': 'edit'}
        response = self.client.put(
            reverse('app:reply', kwargs=args), reply_data)
        self.assertEqual(response.status_code, 200)
        reply = Reply.objects.get(pk=1)
        self.assertEqual(reply.content, 'new test reply content')

    def test_edit_reply_as_non_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        reply_data = {'content': 'new test reply content', 'action': 'edit'}
        response = self.client.put(
            reverse('app:reply', kwargs=args), reply_data)
        self.assertEqual(response.status_code, 400)
        reply = Reply.objects.get(pk=1)
        self.assertNotEqual(reply.content, 'new test reply content')

    def test_delete_reply_as_reply_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 2}
        self.assertTrue(Reply.objects.filter(pk=2).exists())
        response = self.client.delete(reverse('app:reply', kwargs=args))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Reply.objects.filter(pk=2).exists())

    def test_delete_reply_as_post_author(self):
        self._log_in_helper(self.user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 2}
        self.assertTrue(Reply.objects.filter(pk=2).exists())
        response = self.client.delete(reverse('app:reply', kwargs=args))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Reply.objects.filter(pk=2).exists())

    def test_delete_reply_as_non_author(self):
        self._log_in_helper(self.other_user.username, "Password123")
        args = {'post_id': 1, 'comment_id': 1, 'reply_id': 1}
        self.assertTrue(Reply.objects.filter(pk=1).exists())
        response = self.client.delete(reverse('app:reply', kwargs=args))
        self.assertEqual(response.status_code, 400)
        self.assertTrue(Reply.objects.filter(pk=1).exists())

    def test_get_club_feed(self):
        self._log_in_helper(self.other_user.username, "Password123")
        response = self.client.get(
            reverse('app:club_feed', kwargs={'club_id': 1}))
        club = Club.objects.get(id=1)
        posts = Post.objects.filter(club=club)
        actual_post_ids = [post.id for post in posts]
        post_ids = [post['id'] for post in response.data['posts']]
        self.assertEqual(len(actual_post_ids), len(post_ids))
        self.assertSetEqual(set(actual_post_ids), set(post_ids))
