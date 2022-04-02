# from app.models import User, Club, Chat, Book, Post, BookRating, Comment, Reply
# from django.test.utils import override_settings
# from app.tests.selenium.test_utils import CustomLiveTestCase
# from time import sleep

# from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users, seed_default_objects, \
#     seed_friends, seed_friend_requests, seed_meetings, seed_feed, seed_messages, print_info

# @override_settings(STRIPE_SECRET_KEY='xxx', STRIPE_PUBLISHABLE_KEY='xxx')
# class MembershipTests(CustomLiveTestCase):

#     port = 8000

#     @classmethod
#     def setUpTestData(cls):
#         super(MembershipTests, cls).setUpTestData()
#         seed_books()
#         seed_default_objects()
        

#     def test_signup(self):
#         print(User.objects.all())
#         self.browser.get(f"{self.live_server_url}/")
#         sleep(10000)