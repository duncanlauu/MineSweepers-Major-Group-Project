from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from app.models import Post, User


class FeedAPIViewTestCase(APITestCase):
    """Tests of the Feed related API views."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_post.json',
                'app/tests/fixtures/other_posts.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/others_clubs.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json'
                ]

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.client.force_authenticate(self.user)

    ## ---------- FEED ---------- ##

    def test_get_feed(self):
        """Test user can see posts by themselves, friends, and clubs they are in"""
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

    ## ---------- POST ---------- ##

    def test_get_all_posts_of_user(self):
        response = self.client.get(reverse('app:all_posts'))
        self.assertEqual(response.status_code, 200)
        posts = response.data['posts']
        for post in posts:
            self.assertEqual(post['author_id'], self.user.id)
        self.assertEqual(len(posts), self.user.posts.count())

    def test_create_post_without_optional_fields(self):
        """Test user can create basic post without the optional fields"""
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

    def test_create_post(self):
        title = 'test full post title'
        content = 'test post content'
        club_id = 1
        image_link = 'www.example-link.com'
        book_link = 'www.example-book-link.com'
        form_data = {'title': title, 'content': content, 'club': club_id,
                     'image_link': image_link, 'book_link': book_link}
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
        self.assertEqual(post.image_link, image_link)
        self.assertEqual(post.book_link, book_link)

    def test_get_post(self):
        response = self.client.get(reverse('app:post', kwargs={'post_id': 1}))
        self.assertEqual(response.status_code, 200)
        post = Post.objects.get(id=1)
        self.assertDictEqual(response.data, post.values())

    ## ---------- COMMENT ---------- ##

    ## ---------- REPLY ---------- ##