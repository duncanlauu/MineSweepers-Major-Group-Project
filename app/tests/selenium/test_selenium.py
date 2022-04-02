# from app.models import User, Club, Chat, Book, Post, BookRating, Comment, Reply
# from django.test.utils import override_settings
# from app.tests.selenium.test_utils import CustomLiveTestCase
# from time import sleep

# from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users, seed_default_objects, \
#     seed_friends, seed_friend_requests, seed_meetings, seed_feed, seed_messages, print_info


# class MembershipTests(LiveServerTestCase):

#     port = 8000

#     @classmethod
#     def setUpTestData(cls):
#         super(MembershipTests, cls).setUpTestData()
#         # cls.user = User.objects.create_superuser('Testuser','test@user.com','1234')
#         # seed_books()
#         # seed_default_objects()
        

#     def test_signup(self):
#         print(User.objects.all())
#         self.user = User.objects.create_superuser('Testuser','test@user.com','1234')
#         self.browser.get(f"{self.live_server_url}/")
#         sleep(10000)