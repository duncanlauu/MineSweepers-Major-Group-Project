"""Unit tests for the User model"""
import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Book, FriendRequest

class UserModelTest(TestCase):
    """Test the User model"""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_book.json'
    ]

    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.book = Book.objects.get(title="Harry Potter and the Sorcerer's Stone")
        self.friend = User.objects.get(username='jakedoe')

    def test_valid_user(self):
        self._assert_user_is_valid()

    def test_username_cannot_be_blank(self):
        self.user.username = ''
        self._assert_user_is_invalid()

    def test_username_can_be_50_characters_long(self):
        self.user.username = 'x' * 50
        self._assert_user_is_valid()

    def test_username_cannot_be_over_50_characters_long(self):
        self.user.username = 'j'+'x' * 50
        self._assert_user_is_invalid()

    def test_username_must_be_unique(self):
        second_user = User.objects.get(username='janedoe')
        self.user.username = second_user.username
        self._assert_user_is_invalid()

    def test_username_must_contain_only_alphanumericals(self):
        self.user.username = '@john!doe'
        self._assert_user_is_invalid()

    def test_username_must_contain_at_least_3_alphanumericals(self):
        self.user.username = 'jo'
        self._assert_user_is_invalid()

    def test_username_may_contain_numbers(self):
        self.user.username = 'j0hndoe2'
        self._assert_user_is_valid()


    def test_first_name_must_not_be_blank(self):
        self.user.first_name = ''
        self._assert_user_is_invalid()

    def test_first_name_need_not_be_unique(self):
        second_user = User.objects.get(username='janedoe')
        self.user.first_name = second_user.first_name
        self._assert_user_is_valid()

    def test_first_name_may_contain_50_characters(self):
        self.user.first_name = 'x' * 50
        self._assert_user_is_valid()

    def test_first_name_must_not_contain_more_than_50_characters(self):
        self.user.first_name = 'x' * 51
        self._assert_user_is_invalid()

    

    def test_last_name_must_not_be_blank(self):
        self.user.last_name = ''
        self._assert_user_is_invalid()

    def test_last_name_need_not_be_unique(self):
        second_user = User.objects.get(username='janedoe')
        self.user.last_name = second_user.last_name
        self._assert_user_is_valid()

    def test_last_name_may_contain_50_characters(self):
        self.user.last_name = 'x' * 50
        self._assert_user_is_valid()

    def test_last_name_must_not_contain_more_than_50_characters(self):
        self.user.last_name = 'x' * 51
        self._assert_user_is_invalid()

    
    def test_email_must_not_be_blank(self):
        self.user.email = ''
        self._assert_user_is_invalid()

    def test_email_must_be_unique(self):
        second_user =  User.objects.get(username='janedoe')
        self.user.email = second_user.email
        self._assert_user_is_invalid()

    def test_email_must_contain_username(self):
        self.user.email = '@example.org'
        self._assert_user_is_invalid()

    def test_email_must_contain_at_symbol(self):
        self.user.email = 'johndoe.example.org'
        self._assert_user_is_invalid()

    def test_email_must_contain_domain_name(self):
        self.user.email = 'johndoe@.org'
        self._assert_user_is_invalid()

    def test_email_must_contain_domain(self):
        self.user.email = 'johndoe@example'
        self._assert_user_is_invalid()

    def test_email_must_not_contain_more_than_one_at(self):
        self.user.email = 'johndoe@@example.org'
        self._assert_user_is_invalid()


    def test_bio_may_be_blank(self):
        self.user.bio = ''
        self._assert_user_is_valid()

    def test_bio_need_not_be_unique(self):
        second_user = User.objects.get(username='janedoe')
        self.user.bio = second_user.bio
        self._assert_user_is_valid()

    def test_bio_may_contain_500_characters(self):
        self.user.bio = 'x' * 200
        self._assert_user_is_valid()

    def test_bio_must_not_contain_more_than_500_characters(self):
        self.user.bio = 'x' * 501
        self._assert_user_is_invalid()

    
    
    def test_location_may_be_blank(self):
        self.user.location = ''
        self._assert_user_is_valid()

    def test_location_need_not_be_unique(self):
        second_user = User.objects.get(username='janedoe')
        self.user.location = second_user.location
        self._assert_user_is_valid()

    def test_location_may_contain_70_characters(self):
        self.user.location = 'x' * 70
        self._assert_user_is_valid()

    def test_location_must_not_contain_more_than_70_characters(self):
        self.user.location = 'x' * 71
        self._assert_user_is_invalid()

    
    def test_age_must_not_be_blank(self):
        self.user.birthday = ''
        self._assert_user_is_invalid()

    def test_age_must_not_be_future_date(self):
        self.user.birthday = datetime.date.today() + datetime.timedelta(days=1)
        self._assert_user_is_invalid()


    def test_add_liked_book(self):
        self.assertEqual(self.user.liked_books.count(), 0)
        self.user.add_liked_book(self.book)
        self.assertEqual(self.user.liked_books.count(), 1)

    def test_add_read_book(self):
        self.assertEqual(self.user.read_books.count(), 0)
        self.user.add_read_book(self.book)
        self.assertEqual(self.user.read_books.count(), 1)

    def test_remove_liked_book(self):
        self.user.add_liked_book(self.book)
        self.assertEqual(self.user.liked_books.count(), 1)
        self.user.remove_liked_book(self.book)
        self.assertEqual(self.user.liked_books.count(), 0)

    def test_remove_read_book(self):
        self.user.add_read_book(self.book)
        self.assertEqual(self.user.read_books.count(), 1)
        self.user.remove_read_book(self.book)
        self.assertEqual(self.user.read_books.count(), 0)

    def test_liked_book_count(self):
        self.assertEqual(self.user.liked_books_count(), self.user.liked_books.count())
        self.user.add_liked_book(self.book)
        self.assertEqual(self.user.liked_books_count(), self.user.liked_books.count())

    def test_read_book_count(self):
        self.assertEqual(self.user.read_books_count(), self.user.read_books.count())
        self.user.add_read_book(self.book)
        self.assertEqual(self.user.read_books_count(), self.user.read_books.count())


    def test_valid_add_friend(self):
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        friend_count_before = self.user.friends.count()
        self.user.add_friend(self.friend)
        friend_count_after = self.user.friends.count()
        self.assertEqual(friend_count_before + 1, friend_count_after)
        self.assertTrue(self.user.friends.filter(username=self.friend.username).exists())

    def test_valid_remove_friend(self):
        self.user.add_friend(self.friend)
        self.assertTrue(self.user.friends.filter(username=self.friend.username).exists())
        friend_count_before = self.user.friends.count()
        self.user.remove_friend(self.friend)
        friend_count_after = self.user.friends.count()
        self.assertEqual(friend_count_before - 1, friend_count_after)
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())

    def test_valid_send_friend_request(self):
        self.user.send_friend_request(self.friend)
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        self.assertTrue(FriendRequest.objects.filter(sender=self.user, receiver=self.friend).exists())

    def test_send_friend_request_to_friend(self):
        self.user.add_friend(self.friend)
        self.assertTrue(self.user.friends.filter(username=self.friend.username).exists())
        self.user.send_friend_request(self.friend)
        self.assertFalse(FriendRequest.objects.filter(sender=self.user, receiver=self.friend).exists())

    def test_send_friend_request_with_existing_request(self):
        FriendRequest.objects.create(sender=self.user, receiver=self.friend)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.send_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(friend_request_count_before, friend_request_count_after)

    def test_send_friend_request_to_a_user_who_already_sent_self_a_request(self):
        FriendRequest.objects.create(sender=self.friend, receiver=self.user)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.send_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(friend_request_count_before, friend_request_count_after)

    def test_valid_accept_friend_request(self):
        FriendRequest.objects.create(sender=self.friend, receiver=self.user)
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        self.assertFalse(self.friend.friends.filter(username=self.user.username).exists())
        friend_request_count_before = FriendRequest.objects.count()
        self.user.accept_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertTrue(self.user.friends.filter(username=self.friend.username).exists())
        self.assertTrue(self.friend.friends.filter(username=self.user.username).exists())
        self.assertEqual(friend_request_count_before - 1, friend_request_count_after)

    def test_accept_friend_request_when_user_is_already_friends(self):
        self.user.add_friend(self.friend)
        self.assertTrue(self.user.friends.filter(username=self.friend.username).exists())
        friend_request_count_before = FriendRequest.objects.count()
        self.user.accept_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(friend_request_count_before, friend_request_count_after)

    def test_accept_friend_request_when_there_are_no_incoming_requests(self):
        # outgoing request
        FriendRequest.objects.create(sender=self.user, receiver=self.friend)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.accept_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(friend_request_count_before, friend_request_count_after)

    def test_valid_reject_friend_request(self):
        FriendRequest.objects.create(sender=self.friend, receiver=self.user)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.reject_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        self.assertFalse(self.friend.friends.filter(username=self.user.username).exists())
        self.assertEqual(friend_request_count_before - 1, friend_request_count_after)

    def test_reject_friend_request_with_a_non_existing_request(self):
        # outgoing request
        FriendRequest.objects.create(sender=self.user, receiver=self.friend)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.reject_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        self.assertFalse(self.friend.friends.filter(username=self.user.username).exists())
        self.assertEqual(friend_request_count_before, friend_request_count_after)

    def test_cancel_friend_request(self):
        FriendRequest.objects.create(sender=self.user, receiver=self.friend)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.cancel_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        self.assertFalse(self.friend.friends.filter(username=self.user.username).exists())
        self.assertEqual(friend_request_count_before - 1, friend_request_count_after)

    def test_cancel_friend_request_with_a_non_existing_request(self):
        # incoming request
        FriendRequest.objects.create(sender=self.friend, receiver=self.user)
        friend_request_count_before = FriendRequest.objects.count()
        self.user.cancel_friend_request(self.friend)
        friend_request_count_after = FriendRequest.objects.count()
        self.assertFalse(self.user.friends.filter(username=self.friend.username).exists())
        self.assertFalse(self.friend.friends.filter(username=self.user.username).exists())
        self.assertEqual(friend_request_count_before, friend_request_count_after)


    def _assert_user_is_valid(self):
        try:
            self.user.full_clean()
        except (ValidationError):
            self.fail('Test user should be valid')

    def _assert_user_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.user.full_clean()    
    