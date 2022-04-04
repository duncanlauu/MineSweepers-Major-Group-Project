from time import sleep
from django.test import LiveServerTestCase
from django.conf import settings

from app.models import FriendRequest, Meeting, User, Club, Chat, Book, Post, BookRating, Comment, Reply
from django.core.management import call_command
from django.core import mail

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select

from datetime import datetime

from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, generate_pred_set, train_model, test_model, dump_trained_model, load_trained_model
from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users, seed_default_objects, \
    seed_friends, seed_friend_requests, seed_meetings, seed_feed, seed_messages, print_info, get_n_random_non_friends, \
        get_user
from surprise import SVD
from django.db import connections
import os

from selenium.webdriver.common.action_chains import ActionChains

class MyException(Exception):
    pass
    

class FrontendFunctionalityTest(LiveServerTestCase):

    port = 8000

    failed_test_cases = []
    succesful_test_cases = []
    error_message_report = ""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Call collectstatic before running live server
        call_command('collectstatic', verbosity=0, interactive=False)
        chrome_options = Options()

        run_headless = eval(os.environ.get('RUN_HEADLESS', 'True'))
        print(run_headless)
        if(run_headless):
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--window-size=1200,800")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--allow-insecure-localhost")

        # //specifically this line here :)
        # chromeOptions.AddAdditionalCapability("acceptInsecureCerts", true, true);

        cls.browser = webdriver.Chrome(chrome_options=chrome_options)
        cls.browser.set_page_load_timeout(120)
        cls.actions = ActionChains(cls.browser)
        cls.browser.delete_all_cookies()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.browser.quit()

    def setUp(self):
        # Seed the database
        seed_books()
        seed_default_objects()
        seed_users(150)
        seed_ratings()
        seed_clubs(10)
        seed_friends()
        seed_friend_requests()
        seed_friend_requests()
        seed_meetings()
        seed_feed()
        seed_messages()
        print_info()

        # Train the recommender system model
        self.csv_file_path = 'app/files/BX-Book-Ratings-filtered.csv'
        self.dump_file_path = 'app/files/dump_file'
        self.dataframe = get_combined_data(self.csv_file_path)
        self.data = get_dataset_from_dataframe(self.dataframe)
        self.trainset = get_trainset_from_dataset(self.data)
        self.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
        train_model(self.algo, self.trainset)
        self.pred = test_model(self.algo, self.trainset)
        dump_trained_model(self.dump_file_path, self.algo, self.pred)

        # Objects used for testing
        self.user = User.objects.get(username='Jeb')
        self._seed_additional_friend_requests(self.user)
        self.user_without_ratings = User.objects.create(
            username="userWithoutRatings",
            first_name="User",
            last_name="User",
            email="User@example.org",
            bio="Never read Fitzgerald? You Gatsby kidding me!!",
            location="Actually I'm currently in an undisclosed location..",
            birthday=datetime(year=2011, month=6, day=24),
            password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
        )  
        self.login_data = {
            "username": self.user.username,
            "password": "Password123",
        }
        self.club = Club.objects.get(name="Kerbal book club")
        self.club_where_admin = Club.objects.all()[1]
        self.club_where_admin.add_member(self.user)
        self.club_where_admin.promote(self.user)
        self.club_where_member = Club.objects.all()[2]
        self.club_where_member.add_member(self.user)
        self.club_where_non_member = Club.objects.all()[3]
        self._seed_additional_club_users(self.club)
        self.book = Book.objects.all()[0]
        self.new_user_data = {
            "first_name": "firstName",
            "last_name": "lastName",
            "username": "newUsername",
            "email": "newemail@example.com",
            "password": "Password123",
            "bio": "New bio",
            "location": "London, UK",
            "birthday": "10102000"
        }
        self.new_club_data = {
            "name": "New Club Name",
            "description": "New description"
        }

    def run_testcase(self, test_case, log_in, url=None):
        try:
            print(f"Running Test Case - {test_case.__name__}")
            if log_in:
                self._log_in()
            if url is None:
                test_case()
                self.succesful_test_cases.append((test_case, url))
            else:
                test_case(url)
        except Exception as e:
            print(f"TEST CASE FAILED - {test_case.__name__}:")
            print(e)
            self.failed_test_cases.append((test_case, url))
            self.error_message_report += f"\n{test_case.__name__}, ({url}): {e}"
        finally:
            self.browser.get(f"{self.live_server_url}/log_out")
            self._close_db_connections()

    def test_everything(self):
        # Landing Page 
        self.run_testcase(self._test_boogkle_logo_redirects_to_landing_page, False, "")
        self.run_testcase(self._test_landing_page_log_in_button, False)
        self.run_testcase(self._test_landing_page_sign_up_button, False)

        # Log In Page 
        self.run_testcase(self._test_boogkle_logo_redirects_to_landing_page, False, "log_in") 
        self.run_testcase(self._text_sign_up_here_button_redirects_to_sign_up, False)
        self.run_testcase(self._test_forgot_password_button_redirects_to_password_reset, False)
        self.run_testcase(self._test_log_in_with_wrong_password, False)
        self.run_testcase(self._test_log_in, False)

        # Sign Up Page
        self.run_testcase(self._test_boogkle_logo_redirects_to_landing_page, False, "sign_up")
        self.run_testcase(self._test_log_in_here_button_redirects_to_log_in, False)
        self.run_testcase(self._test_sign_up_with_blank_fields, False) 
        self.run_testcase(self._test_sign_up_username_too_short, False) 
        self.run_testcase(self._test_sign_up_invalid_email, False)

        # Sign Up Page and new user Book Rating Page 
        self.run_testcase(self._test_sign_up_and_book_rating, False) 

        # Home Page
        self.run_testcase(self._test_reply_to_comment_on_post, True)
        self.run_testcase(self._test_comment_on_post, True)
        self.run_testcase(self._test_like_post, True)
        self.run_testcase(self._test_home_page_see_all_your_recommendations_button, True)
        self.run_testcase(self._test_home_page_see_all_club_recommendations_button, True)
        self.run_testcase(self._test_home_page_see_all_clubs_button, True)
        self.run_testcase(self._test_home_page_recommended_book, True)
        self.run_testcase(self._test_home_page_recommended_club, True)

        # Navbar
        self.run_testcase(self._test_boogkle_logo_redirects_to_home_when_logged_in, True, "home")
        self.run_testcase(self._test_open_and_close_search_bar, True, "home")
        self.run_testcase(self._test_navbar_create_new_post, True, "home")
        self.run_testcase(self._test_new_club_button_redirects_to_create_club, True, "home")
        self.run_testcase(self._test_open_chat_button, True, "home")
        self.run_testcase(self._test_open_meetings_page, True, "home")
        self.run_testcase(self._test_open_profile_page, True, "home")
        self.run_testcase(self._test_log_out_button, True, "home")

        # Search Bar
        self.run_testcase(self._test_search_bar_find_user, True, "all_clubs")
        self.run_testcase(self._test_search_bar_find_club, True, "all_clubs")
        self.run_testcase(self._test_search_bar_find_book, True, "all_clubs") 
        self.run_testcase(self._test_create_club, True, "all_clubs")

        # User Page
        self.run_testcase(self._test_user_profile_user_profile_cotains_correct_information, True)
        self.run_testcase(self._test_edit_user_profile, True) 
        self.run_testcase(self._test_user_profile_posts_tab_contains_correct_information, True) 
        self.run_testcase(self._test_edit_post, True) 
        self.run_testcase(self._test_delete_post, True) 
        self.run_testcase(self._test_accept_friend_request, True) 
        self.run_testcase(self._test_reject_friend_request, True) 
        self.run_testcase(self._test_delete_friend, True) 
        self.run_testcase(self._test_user_profile_suggested_friends, True) 

        # Club Profile Page As Owner
        self.run_testcase(self._test_club_profile_contains_correct_information_as_owner , True) 
        self.run_testcase(self._test_club_feed_contains_correct_information_as_owner, True) 
        self.run_testcase(self._test_club_members_contains_correct_information_as_owner, True) 
        self.run_testcase(self._test_club_meetings_page_contains_correct_information_as_owner, True) 
        self.run_testcase(self._test_schedule_meeting_as_owner, True) 
        self.run_testcase(self._test_accept_club_applicant_as_owner, True)
        self.run_testcase(self._test_reject_club_applicant_as_owner, True)
        self.run_testcase(self._test_promote_member_to_admin_as_owner, True)
        self.run_testcase(self._test_demote_admin_to_member_as_owner, True) 
        self.run_testcase(self._test_ban_member_as_owner, True) 
        self.run_testcase(self._test_ban_admin_as_owner, True) 
        self.run_testcase(self._test_unban_banned_user_as_owner, True) 
        self.run_testcase(self._test_transfer_ownership_to_admin_and_leave_club, True) 

        # Club Profile Page As Admin
        self.run_testcase(self._test_club_profile_contains_correct_information_as_admin, True) 
        self.run_testcase(self._test_club_feed_contains_correct_information_as_admin, True)
        self.run_testcase(self._test_club_members_contains_correct_information_as_admin, True) 
        self.run_testcase(self._test_accept_club_applicant_as_admin, True) 
        self.run_testcase(self._test_reject_club_applicant_as_admin, True)
        self.run_testcase(self._test_ban_member_as_admin, True) 
        self.run_testcase(self._test_unban_banned_user_as_admin, True)
        
        # Club Profile Page As Member
        self.run_testcase(self._test_club_profile_contains_correct_information_as_member, True) 
        self.run_testcase(self._test_club_feed_contains_correct_information_as_member, True) 
        self.run_testcase(self._test_club_members_contains_correct_information_as_member, True) 

        # Club Profile Page As Non-Member
        self.run_testcase(self._test_club_profile_contains_correct_information_as_non_member, True) 
        self.run_testcase(self._test_club_profile_apply_and_withdraw_application_as_non_member, True) 

        # All Clubs Page
        # self.run_testcase(self._test_all_clubs_page_contains_all_clubs, True)
        self.run_testcase(self._test_all_clubs_page_visit_club_profile, True) 
        
        # Book Profile Page
        self.run_testcase(self._test_book_profile_page_contains_correct_information, True) # Works
        self.run_testcase(self._test_book_profile_rate_book, True) # Works
        self.run_testcase(self._test_book_profile_update_book_rating, True) # Works
        self.run_testcase(self._test_book_profile_see_your_recommendations_button, True) # Works

        # Chat Page
        ''' Unable to _test chat frontend functionality (Connecting to websocket) with selenium
        due to a python multihtreading error when running ChannelsLiveServerTestCase.
        https://github.com/django/channels/issues/1485 '''
        self.run_testcase(self._test_chat_page, True) 

        # Password Reset
        self.run_testcase(self._test_password_reset, False)

        # Is Login Protected
        self.run_testcase(self._test_log_out_is_login_protected, False) 
        self.run_testcase(self._test_sign_up_rating_is_login_protected, False) 
        self.run_testcase(self._test_waiting_is_login_protected, False)
        self.run_testcase(self._test_home_is_login_protected, False)
        self.run_testcase(self._test_club_profile_is_login_protected, False)
        self.run_testcase(self._test_create_club_is_login_protected, False)
        self.run_testcase(self._test_user_profile_is_login_protected, False)
        self.run_testcase(self._test_chat_is_login_protected, False)
        self.run_testcase(self._test_scheduling_is_login_protected, False)
        self.run_testcase(self._test_meetings_is_login_protected, False)
        self.run_testcase(self._test_recommendations_is_login_protected, False)
        self.run_testcase(self._test_recommend_clubs_is_login_protected, False)
        self.run_testcase(self._test_book_profile_is_login_protected, False)
        self.run_testcase(self._test_all_clubs_is_login_protected, False)

        # Requires Ratings
        self.run_testcase(self._test_home_requires_ratings, False)
        self.run_testcase(self._test_club_profile_requires_ratings, False)
        self.run_testcase(self._test_create_club_requires_ratings, False)
        self.run_testcase(self._test_user_profile_requires_ratings, False)
        self.run_testcase(self._test_chat_requires_ratings, False)
        self.run_testcase(self._test_scheduling_requires_ratings, False)
        self.run_testcase(self._test_meetings_requires_ratings, False)
        self.run_testcase(self._test_recommendations_requires_ratings, False)
        self.run_testcase(self._test_recommend_clubs_requires_ratings, False)
        self.run_testcase(self._test_book_profile_requires_ratings, False)
        self.run_testcase(self._test_all_clubs_requires_ratings, False)

        if self.failed_test_cases:
            failed_tests_msg = f"FAILED TEST CASES ({len(self.failed_test_cases)} F / {len(self.succesful_test_cases)} OK):\n"
            for test_case in self.failed_test_cases:
                test_case_name = f"{test_case[0].__name__}"
                test_case_url = f"{test_case[1]}"
                failed_tests_msg += f"{test_case_name}"
                if test_case_url is not None:
                    failed_tests_msg += f", ({test_case_url})"
                failed_tests_msg += "\n"
            print(self.error_message_report)
            raise MyException(failed_tests_msg)
        else:
            print(f"All ({len(self.succesful_test_cases)}) tests passed!")

    # Login Required
    def _test_log_out_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/log_out/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_sign_up_rating_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/sign_up/rating")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_waiting_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/waiting")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_home_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/home")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_club_profile_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_non_member.pk}/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_create_club_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/create_club")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_user_profile_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/user_profile/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_chat_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/chat/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_scheduling_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/scheduling/{self.club.pk}/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_meetings_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/meetings/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_recommendations_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/recommendations/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_recommend_clubs_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/recommend_clubs/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_book_profile_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/book_profile/{self.book.pk}/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    def _test_all_clubs_is_login_protected(self):
        self.browser.get(f"{self.live_server_url}/all_clubs/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")

    # Ratings Required
    def _test_home_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/home")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_club_profile_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_non_member.pk}/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_create_club_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/create_club")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_user_profile_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/user_profile/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_chat_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/chat/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_scheduling_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/scheduling/{self.club.pk}/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_meetings_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/meetings/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_recommendations_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/recommendations/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_recommend_clubs_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/recommend_clubs/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_book_profile_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/book_profile/{self.book.pk}/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    def _test_all_clubs_requires_ratings(self):
        self._log_in_user_without_ratings()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/all_clubs/")
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")

    # Club Profile as non-member
    def _test_club_profile_contains_correct_information_as_non_member(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_non_member.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Profile"]') 
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        self.browser.implicitly_wait(10)
        sleep(5)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue(self.club_where_non_member.name in body_text)
        print(body_text)
        print("Club Profile as non-member1")
        self.assertFalse("If you would like to leave the club, please transfer the ownership" in body_text)
        print("Club Profile as non-member2")
        self.assertTrue("Apply" in body_text)
        print("Club Profile as non-member3")
        self.assertFalse("Leave Club" in body_text)
        print("Club Profile as non-member4")
        self.assertTrue("PROFILE" in body_text)
        self.assertFalse("MEMBERS" in body_text)
        self.assertFalse("FEED" in body_text)
        self.assertFalse("MEETINGS" in body_text)
        print("Club Profile as non-member5")
        # club_book_history = self.club_where_non_member.books.all()
        # for book in club_book_history:
        #     self.assertTrue(book.title in body_text)
        #     self.assertTrue(book.author in body_text)
        #     self.assertTrue(str(book.publication_date) in body_text)
        # print("Club Profile as non-member6")

    def _test_club_profile_apply_and_withdraw_application_as_non_member(self):
        number_of_applicants_before = self.club_where_non_member.applicants.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_non_member.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Profile"]') 
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Apply"]')
        self.browser.find_element_by_xpath('//button[.="Apply"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        number_of_applicants_after = self.club_where_non_member.applicants.count()
        self.assertEqual(number_of_applicants_before + 1, number_of_applicants_after)
        self.assertTrue(self.user in self.club_where_non_member.applicants.all())
        self.wait_until_element_found('//button[.="Withdraw Application"]')
        self.browser.find_element_by_xpath('//button[.="Withdraw Application"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        number_of_applicants_after_withdraw = self.club_where_non_member.applicants.count()
        self.assertEqual(number_of_applicants_before, number_of_applicants_after_withdraw)
        self.assertFalse(self.user in self.club_where_non_member.applicants.all())


    # Club Progile as Member
    def _test_club_profile_contains_correct_information_as_member(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_member.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Profile"]') 
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue(self.club_where_member.name in body_text)
        self.assertFalse("If you would like to leave the club, please transfer the ownership" in body_text)
        self.assertFalse("Apply" in body_text)
        self.assertTrue("Leave Club" in body_text)
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        # club_book_history = self.club_where_member.books.all()
        # for book in club_book_history:
        #     self.assertTrue(book.title in body_text)
        #     self.assertTrue(book.author in body_text)
        #     self.assertTrue(str(book.publication_date) in body_text)

    def _test_club_feed_contains_correct_information_as_member(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_member.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Feed"]')
        self.browser.find_element_by_xpath('//button[.="Feed"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        club_posts = Post.objects.filter(club=self.club_where_member.pk).values()
        for post in club_posts:
            author_username = User.objects.get(pk=post['author_id']).username
            post_content = post['content'].replace('\n', ' ')
            self.assertTrue(author_username in body_text) 
            self.assertTrue(post['title'] in body_text)
            self.assertTrue(post_content in body_text)

    def _test_club_members_contains_correct_information_as_member(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_member.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(30)
        self.browser.implicitly_wait(10)
        sleep(2)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        self.assertFalse("Make Owner" in body_text)
        self.assertFalse("Promote" in body_text)
        self.assertFalse("Demote" in body_text)
        self.assertFalse("Ban" in body_text)
        self.assertFalse("Accept" in body_text)
        self.assertFalse("Reject" in body_text)
        all_club_users = [self.club_where_member.owner]
        all_club_users += self.club_where_member.admins.all()
        all_club_users += self.club_where_member.members.all()
        all_club_users += self.club_where_member.applicants.all()
        for user in all_club_users:
            self.assertTrue(user.username in body_text)
            self.assertTrue(user.email in body_text)
            self.assertTrue(user.bio[:20] in body_text)

    # Club Profile Page as Admin
    def _test_accept_club_applicant_as_admin(self):
        number_of_members_before = self.club_where_admin.members.count()
        number_of_applicants_before = self.club_where_admin.applicants.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Accept"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        applicant_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Accept" in individual_user_card_text):
                applicant_user_card = individual_user_card
                break
        applicant_username = applicant_user_card.find_element_by_name("username-text").text
        applicant_user_card.find_element_by_xpath('.//button[.="Accept"]').click()
        sleep(1)
        number_of_members_after = self.club_where_admin.members.count()
        number_of_applicants_after = self.club_where_admin.applicants.count()
        self.assertEqual(number_of_members_after, number_of_members_before + 1)
        self.assertEqual(number_of_applicants_after, number_of_applicants_before - 1)
        applicant= User.objects.get(username=applicant_username)
        self.assertTrue(applicant in self.club_where_admin.members.all())

    def _test_reject_club_applicant_as_admin(self):
        number_of_members_before = self.club_where_admin.members.count()
        number_of_applicants_before = self.club_where_admin.applicants.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Accept"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        applicant_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Reject" in individual_user_card_text):
                applicant_user_card = individual_user_card
                break
        applicant_username = applicant_user_card.find_element_by_name("username-text").text
        applicant_user_card.find_element_by_xpath('.//button[.="Reject"]').click()
        sleep(1)
        number_of_members_after = self.club_where_admin.members.count()
        number_of_applicants_after = self.club_where_admin.applicants.count()
        self.assertEqual(number_of_members_after, number_of_members_before)
        self.assertEqual(number_of_applicants_after, number_of_applicants_before - 1)
        applicant= User.objects.get(username=applicant_username)
        self.assertFalse(applicant in self.club_where_admin.members.all())

    def _test_unban_banned_user_as_admin(self):
        number_of_banned_users_before = self.club_where_admin.banned_users.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Unban"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Unban" in individual_user_card_text):
                member_individual_user_card = individual_user_card
                break
        new_unbanned_user_username = member_individual_user_card.find_element_by_name("username-text").text
        new_unbanned_user = User.objects.get(username=new_unbanned_user_username)
        member_individual_user_card.find_element_by_xpath('.//button[.="Unban"]').click()
        sleep(1)
        number_of_banned_users_after = self.club_where_admin.banned_users.count()
        self.assertEqual(number_of_banned_users_after, number_of_banned_users_before - 1)
        self.assertFalse(new_unbanned_user in self.club_where_admin.banned_users.all())

    def _test_ban_member_as_admin(self):
        number_of_banned_users_before = self.club_where_admin.banned_users.count()
        number_of_members_before = self.club_where_admin.members.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Ban"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Ban" in individual_user_card_text):
                member_individual_user_card = individual_user_card
                break
        new_banned_user_username = member_individual_user_card.find_element_by_name("username-text").text
        new_banned_user = User.objects.get(username=new_banned_user_username)
        member_individual_user_card.find_element_by_xpath('.//button[.="Ban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        number_of_banned_users_after = self.club_where_admin.banned_users.count()
        number_of_members_after = self.club_where_admin.members.count()
        self.assertEqual(number_of_banned_users_before + 1, number_of_banned_users_after)
        self.assertEqual(number_of_members_before - 1, number_of_members_after)
        self.assertTrue(new_banned_user in self.club_where_admin.banned_users.all())
        self.assertFalse(new_banned_user in self.club_where_admin.members.all())

    def _test_club_profile_contains_correct_information_as_admin(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Profile"]')
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        self.browser.implicitly_wait(10)
        sleep(3)
        body_text = self.browser.find_element_by_tag_name("body").text
        print(body_text)
        self.assertTrue(self.club_where_admin.name in body_text)
        self.assertFalse("If you would like to leave the club, please transfer the ownership" in body_text)
        self.assertFalse("Apply" in body_text)
        self.assertTrue("Leave Club" in body_text)
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        print("got here")
        # club_book_history = self.club_where_admin.books.all()
        # for book in club_book_history:
        #     self.assertTrue(book.title in body_text)
        #     self.assertTrue(book.author in body_text)
        #     self.assertTrue(str(book.publication_date) in body_text)

    def _test_club_feed_contains_correct_information_as_admin(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Feed"]') # added later
        self.browser.find_element_by_xpath('//button[.="Feed"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        body_text = self.browser.find_element_by_tag_name("body").text
        # Tab Buttons
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        club_posts = Post.objects.filter(club=self.club_where_admin.pk).values()
        for post in club_posts:
            author_username = User.objects.get(pk=post['author_id']).username
            post_content = post['content'].replace('\n', ' ')
            self.assertTrue(author_username in body_text) 
            self.assertTrue(post['title'] in body_text)
            self.assertTrue(post_content in body_text)

    def _test_club_members_contains_correct_information_as_admin(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        self.assertFalse("Make Owner" in body_text)
        self.assertFalse("Promote" in body_text)
        self.assertFalse("Demote" in body_text)
        self.assertTrue("Ban" in body_text)
        self.assertTrue("Accept" in body_text)
        self.assertTrue("Reject" in body_text)
        all_club_users = [self.club_where_admin.owner]
        all_club_users += self.club_where_admin.admins.all()
        all_club_users += self.club_where_admin.members.all()
        all_club_users += self.club_where_admin.applicants.all()
        all_club_users += self.club_where_admin.banned_users.all()
        for user in all_club_users:
            self.assertTrue(user.username in body_text)
            self.assertTrue(user.email in body_text)
            self.assertTrue(user.bio[:20] in body_text)

    # Club Profile Page as Owner
    def _test_accept_club_applicant_as_owner(self):
        number_of_members_before = self.club.members.count()
        number_of_applicants_before = self.club.applicants.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Accept"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        applicant_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Accept" in individual_user_card_text):
                applicant_user_card = individual_user_card
                break
        applicant_username = applicant_user_card.find_element_by_name("username-text").text
        applicant_user_card.find_element_by_xpath('.//button[.="Accept"]').click()
        sleep(1)
        number_of_members_after = self.club.members.count()
        number_of_applicants_after = self.club.applicants.count()
        self.assertEqual(number_of_members_after, number_of_members_before + 1)
        self.assertEqual(number_of_applicants_after, number_of_applicants_before - 1)
        applicant= User.objects.get(username=applicant_username)
        self.assertTrue(applicant in self.club.members.all())

    def _test_reject_club_applicant_as_owner(self):
        number_of_members_before = self.club.members.count()
        number_of_applicants_before = self.club.applicants.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Reject"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        applicant_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Reject" in individual_user_card_text):
                applicant_user_card = individual_user_card
                break
        applicant_username = applicant_user_card.find_element_by_name("username-text").text
        applicant_user_card.find_element_by_xpath('.//button[.="Reject"]').click()
        sleep(1)
        number_of_members_after = self.club.members.count()
        number_of_applicants_after = self.club.applicants.count()
        self.assertEqual(number_of_members_after, number_of_members_before)
        self.assertEqual(number_of_applicants_after, number_of_applicants_before - 1)
        applicant= User.objects.get(username=applicant_username)
        self.assertFalse(applicant in self.club.members.all())

    def _test_unban_banned_user_as_owner(self):
        number_of_banned_users_before = self.club.banned_users.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Unban"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Unban" in individual_user_card_text):
                member_individual_user_card = individual_user_card
                break
        new_unbanned_user_username = member_individual_user_card.find_element_by_name("username-text").text
        new_unbanned_user = User.objects.get(username=new_unbanned_user_username)
        member_individual_user_card.find_element_by_xpath('.//button[.="Unban"]').click()
        sleep(1)
        number_of_banned_users_after = self.club.banned_users.count()
        self.assertEqual(number_of_banned_users_after, number_of_banned_users_before - 1)
        self.assertFalse(new_unbanned_user in self.club.banned_users.all())
        

    def _test_ban_admin_as_owner(self):
        number_of_banned_users_before = self.club.banned_users.count()
        number_of_admins_before = self.club.admins.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Demote"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        admin_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Demote" in individual_user_card_text):
                admin_individual_user_card = individual_user_card
                break
        new_banned_user_username = admin_individual_user_card.find_element_by_name("username-text").text
        new_banned_user = User.objects.get(username=new_banned_user_username)
        admin_individual_user_card.find_element_by_xpath('.//button[.="Ban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        number_of_banned_users_after = self.club.banned_users.count()
        number_of_admins_after = self.club.admins.count()
        self.assertEqual(number_of_banned_users_before + 1, number_of_banned_users_after)
        self.assertEqual(number_of_admins_before - 1, number_of_admins_after)
        self.assertTrue(new_banned_user in self.club.banned_users.all())
        self.assertFalse(new_banned_user in self.club.admins.all())
        

    def _test_ban_member_as_owner(self):
        number_of_banned_users_before = self.club.banned_users.count()
        number_of_members_before = self.club.members.count()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Promote"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Promote" in individual_user_card_text):
                member_individual_user_card = individual_user_card
                break
        new_banned_user_username = member_individual_user_card.find_element_by_name("username-text").text
        new_banned_user = User.objects.get(username=new_banned_user_username)
        member_individual_user_card.find_element_by_xpath('.//button[.="Ban"]').click()
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        sleep(2)
        number_of_banned_users_after = self.club.banned_users.count()
        number_of_members_after = self.club.members.count()
        self.assertEqual(number_of_banned_users_before + 1, number_of_banned_users_after)
        self.assertEqual(number_of_members_before - 1, number_of_members_after)
        self.assertTrue(new_banned_user in self.club.banned_users.all())
        self.assertFalse(new_banned_user in self.club.members.all())

    def _test_promote_member_to_admin_as_owner(self):
        number_of_admins_before = len(self.club.admins.all())
        number_of_members_before = len(self.club.members.all())
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Promote"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Promote" in individual_user_card_text):
                member_individual_user_card = individual_user_card
                break
        new_promoted_user_username = member_individual_user_card.find_element_by_name("username-text").text
        new_promoted_user = User.objects.get(username=new_promoted_user_username )
        member_individual_user_card.find_element_by_xpath('.//button[.="Promote"]').click()
        sleep(1)
        number_of_admins_after = len(self.club.admins.all())
        number_of_members_after = len(self.club.members.all())
        self.assertEqual(number_of_admins_after, number_of_admins_before + 1)
        self.assertEqual(number_of_members_after, number_of_members_before - 1)
        self.assertTrue(new_promoted_user in self.club.admins.all())
        self.assertFalse(new_promoted_user in self.club.members.all())

    def _test_demote_admin_to_member_as_owner(self):
        number_of_admins_before = len(self.club.admins.all())
        number_of_members_before = len(self.club.members.all())
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Demote"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        admin_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Demote" in individual_user_card_text):
                admin_individual_user_card = individual_user_card
                break
        new_demoted_user_username = admin_individual_user_card.find_element_by_name("username-text").text
        new_demoted_user = User.objects.get(username=new_demoted_user_username)
        admin_individual_user_card.find_element_by_xpath('.//button[.="Demote"]').click()
        sleep(1)
        number_of_admins_after = len(self.club.admins.all())
        number_of_members_after = len(self.club.members.all())
        self.assertEqual(number_of_admins_after, number_of_admins_before - 1)
        self.assertEqual(number_of_members_after, number_of_members_before + 1)
        self.assertFalse(new_demoted_user in self.club.admins.all())
        self.assertTrue(new_demoted_user in self.club.members.all())
        

    def _test_transfer_ownership_to_admin_and_leave_club(self):
        club_owner_before = self.club.owner
        self.assertTrue(club_owner_before, self.user)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.wait_until_element_found('//button[.="Make Owner"]')
        individual_user_cards = self.browser.find_elements_by_name("individual-user-card")
        admin_individual_user_card = None
        for individual_user_card in individual_user_cards:
            individual_user_card_text = individual_user_card.text
            if("Make Owner" in individual_user_card_text):
                admin_individual_user_card = individual_user_card
                break
        new_owner_username = admin_individual_user_card.find_element_by_name("username-text").text
        new_owner = User.objects.get(username=new_owner_username)
        admin_individual_user_card.find_element_by_xpath('.//button[.="Make Owner"]').click()
        sleep(4)
        club_owner_after = Club.objects.get(pk=self.club.pk).owner
        self.assertNotEqual(club_owner_before, club_owner_after)
        self.assertEqual(club_owner_after, new_owner)
        self.assertFalse(new_owner in self.club.admins.all())
        self.assertTrue(self.user in self.club.admins.all())
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.wait_until_element_found('//button[.="Leave Club"]')
        number_of_admins_before = len(self.club.admins.all())
        self.browser.find_element_by_xpath('//button[.="Leave Club"]').click()
        sleep(1)   
        number_of_admins_after = len(self.club.admins.all())
        self.assertEqual(number_of_admins_after, number_of_admins_before - 1)
        self.assertFalse(self.user in self.club.admins.all())
        self.assertFalse(self.user in self.club.members.all())

    def _test_club_profile_contains_correct_information_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Profile"]') # added later
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        self.browser.implicitly_wait(10)
        sleep(4)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue(self.club.name in body_text)
        # self.assertTrue(self.club.description in body_text)
        print("owner1")
        self.assertTrue("If you would like to leave the club, please transfer the ownership" in body_text)
        print("owner2")
        self.assertFalse("Apply" in body_text)
        print("owner3")
        self.assertFalse("Leave Club" in body_text)
        print("owner4")
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        print("owner5")
        # club_book_history = self.club.books.all()
        # for book in club_book_history:
        #     self.assertTrue(book.title in body_text)
        #     print("owner6")
        #     self.assertTrue(book.author in body_text)
        #     self.assertTrue(str(book.publication_date) in body_text)

    def _test_club_feed_contains_correct_information_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Feed"]') # added later
        self.browser.find_element_by_xpath('//button[.="Feed"]').click()
        self.browser.implicitly_wait(10)
        sleep(2)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        club_posts = Post.objects.filter(club=self.club.pk).values()
        for post in club_posts:
            author_username = User.objects.get(pk=post['author_id']).username
            post_content = post['content'].replace('\n', ' ')
            self.assertTrue(author_username in body_text) 
            self.assertTrue(post['title'] in body_text)
            self.assertTrue(post_content in body_text)

    def _test_club_members_contains_correct_information_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Members"]')
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        self.browser.implicitly_wait(10)
        sleep(3)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("PROFILE" in body_text)
        self.assertTrue("MEMBERS" in body_text)
        self.assertTrue("FEED" in body_text)
        self.assertTrue("MEETINGS" in body_text)
        self.assertTrue("Make Owner" in body_text)
        self.assertTrue("Promote" in body_text)
        self.assertTrue("Demote" in body_text)
        self.assertTrue("Ban" in body_text)
        self.assertTrue("Accept" in body_text)
        self.assertTrue("Reject" in body_text)
        all_club_users = [self.club.owner]
        all_club_users += self.club.admins.all()
        all_club_users += self.club.members.all()
        all_club_users += self.club.applicants.all()
        all_club_users += self.club.banned_users.all()
        for user in all_club_users:
            self.assertTrue(user.username in body_text)
            self.assertTrue(user.email in body_text)
            self.assertTrue(user.bio[:20] in body_text)

    def _test_club_meetings_page_contains_correct_information_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Meetings"]')
        self.browser.find_element_by_xpath('//button[.="Meetings"]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Schedule a meeting"]')
        body_text = self.browser.find_element_by_tag_name("body").text
        print(body_text)
        meeting_cards = self.browser.find_elements_by_xpath('//div[@data-testid="singleMeetingCard"]')
        print(len(meeting_cards))
        self.assertEqual(Meeting.objects.filter(club=self.club).count(), len(meeting_cards))

    def _test_schedule_meeting_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Meetings"]')
        self.browser.find_element_by_xpath('//button[.="Meetings"]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Schedule a meeting"]')
        self.browser.find_element_by_xpath('//button[.="Schedule a meeting"]').click()
        sleep(2)
        self.browser.implicitly_wait(25)
        self.wait_until_element_found('//input[@id="name"]')
        self.browser.find_element_by_id("name").send_keys("New Meeting Name")
        self.browser.find_element_by_id("description").send_keys("New Meeting Description")
        book_select = Select(self.browser.find_element_by_id("book-select"))
        book_select.select_by_index(2)
        self.browser.find_element_by_id("start_time").send_keys("10102022")
        self.browser.find_element_by_id("start_time").send_keys(Keys.TAB)
        self.browser.find_element_by_id("start_time").send_keys("1000")
        self.browser.find_element_by_id("end_time").send_keys("10102022")
        self.browser.find_element_by_id("end_time").send_keys(Keys.TAB)
        self.browser.find_element_by_id("end_time").send_keys("1200")
        self.browser.find_element_by_id("link").send_keys("www.NewMeetingLink.com")
        self.browser.find_element_by_xpath('//button[.="Create"]').click()
        sleep(2)
        self.browser.implicitly_wait(20)
        # check db



    # Landing Page
    def _test_boogkle_logo_redirects_to_landing_page(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.assertEquals(self.browser.title, "Bookgle")
        self.browser.find_element_by_xpath('//a[.="bookgle"]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)

    def _test_landing_page_log_in_button(self):
        self.browser.get(f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)

    def _test_landing_page_sign_up_button(self):
        self.browser.get(f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//a[@href='/sign_up/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Sign Up']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/")
        self.browser.implicitly_wait(10)

    # Log In Page
    def _text_sign_up_here_button_redirects_to_sign_up(self):
        self.browser.get(f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath('//a[.="here "]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Sign Up']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/")
        self.browser.implicitly_wait(10)

    def _test_log_in_with_wrong_password(self):
        self.browser.get(f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys("WrongPassword123")
        self.browser.find_element_by_xpath("//button[.='Log In']").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Invalid username/password" in body_text)

    def _test_log_in(self):
        self.browser.get(f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath("//button[.='Log In']").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
        self.browser.implicitly_wait(10)
    
    def _test_forgot_password_button_redirects_to_password_reset(self):
        self.browser.get(f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath('//a[.="Forgot Password?"]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Send Reset Email']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/password_reset/")

    # Sign Up Page
    def _test_log_in_here_button_redirects_to_log_in(self):
        self.browser.get(f"{self.live_server_url}/sign_up/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath('//a[.="here "]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)

    def _test_sign_up_with_blank_fields(self):
        number_of_users_before = User.objects.count()
        self.browser.get(f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//a[@href='/sign_up/']").click()
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        number_of_users_after = User.objects.count()
        self.assertEqual(number_of_users_after, number_of_users_before)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/")
        self.browser.implicitly_wait(10)
        body_text = self.browser.find_element_by_tag_name("body").text
        number_of_empty_field_error_messages = body_text.count("This field may not be blank.")
        self.assertEqual(number_of_empty_field_error_messages, 5)
        self.assertTrue("Date has wrong format. Use one of these formats instead: YYYY-MM-DD." in  body_text)

    def _test_sign_up_invalid_email(self):
        number_of_users_before = User.objects.count()
        self.browser.get(f"{self.live_server_url}/sign_up/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Sign Up"]')
        self.browser.find_element_by_name("email").send_keys("a")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Enter a valid email address." in body_text)
        self.browser.find_element_by_name("email").send_keys("@")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Enter a valid email address." in body_text)
        self.browser.find_element_by_name("email").send_keys("a")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Enter a valid email address." in body_text)
        self.browser.find_element_by_name("email").send_keys(".")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Enter a valid email address." in body_text)
        self.browser.find_element_by_name("email").send_keys("com")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        number_of_users_after = User.objects.count()
        self.assertFalse("Enter a valid email address." in body_text)
        self.assertEqual(number_of_users_after, number_of_users_before)

    def _test_sign_up_username_too_short(self):
        number_of_users_before = User.objects.count()
        self.browser.get(f"{self.live_server_url}/sign_up/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//button[.="Sign Up"]')
        self.browser.find_element_by_name("username").send_keys("a")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Username must consist of at least three alphanumericals" in body_text)
        self.browser.find_element_by_name("username").send_keys("a")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Username must consist of at least three alphanumericals" in body_text)
        self.browser.find_element_by_name("username").send_keys("a")
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertFalse("Username must consist of at least three alphanumericals" in body_text)
        number_of_users_after = User.objects.count()
        self.assertEqual(number_of_users_after, number_of_users_before)

    def _test_sign_up_and_book_rating(self):
        number_of_users_before = User.objects.count()
        self.browser.get(f"{self.live_server_url}/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.browser.find_element_by_xpath("//a[@href='/sign_up/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Sign Up']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/")
        self.browser.find_element_by_name("first_name").send_keys(self.new_user_data['first_name'])
        self.browser.find_element_by_name("last_name").send_keys(self.new_user_data['last_name'])
        self.browser.find_element_by_name("username").send_keys(self.new_user_data['username'])
        self.browser.find_element_by_name("email").send_keys(self.new_user_data['email'])
        self.browser.find_element_by_name("password").send_keys(self.new_user_data['password'])
        self.browser.find_element_by_name("bio").send_keys(self.new_user_data['bio'])
        self.browser.find_element_by_name("location").send_keys(self.new_user_data['location'])
        self.browser.find_element_by_name("birthday").send_keys(self.new_user_data['birthday'])
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.browser.implicitly_wait(20)
        sleep(1)
        number_of_users_after = User.objects.count()
        self.assertEqual(number_of_users_after, number_of_users_before+1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")
        self.wait_until_element_found("//span[@data-index='3']", 30)
        self.browser.find_element_by_xpath("//span[@data-index='3']").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.browser.find_element(by=By.XPATH, value='//button[.="Clear"]').click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.browser.find_element_by_xpath("//span[@data-index='4']").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        sleep(2)
        self.browser.find_element_by_xpath('//button[.="Finish"]').click()
        self.browser.implicitly_wait(10)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/waiting")
        self.wait_until_element_found("//a[@href='/home/']", 50)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")



    def _test_boogkle_logo_redirects_to_home_when_logged_in(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath('//a[.="bookgle"]').click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//text[.="See all recommendations"]')
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/")

    def _test_open_and_close_search_bar(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        sleep(4)
        # self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_name("search-bar-input").send_keys("J")
        self.browser.find_element_by_name("search-bar-button").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.browser.find_element_by_xpath("//button[@aria-label='Close']").click()
        self.browser.implicitly_wait(10)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/{url}/")
        self.browser.implicitly_wait(10)

    def _test_navbar_create_new_post(self, url):
        number_of_posts_before = Post.objects.count()
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//img[@alt='New Post Button']")
        self.browser.find_element_by_xpath("//img[@alt='New Post Button']").click()
        self.wait_until_element_found("//button[.='Post!']")
        self.browser.find_element_by_name("title").send_keys("New Post Title From " + url)
        self.browser.find_element_by_name("content").send_keys("New Post Content From " + url)
        self.browser.find_element_by_xpath("//button[.='Post!']").click()
        sleep(2)
        number_of_posts_after = Post.objects.count()
        self.assertEqual(number_of_posts_after, number_of_posts_before + 1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/")

    # Make a test where select club for post

    def _test_new_club_button_redirects_to_create_club(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//img[@alt='New Club Button']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Create']")
        self.browser.find_element_by_id("description").send_keys("New Club Description!!")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/create_club/")

    # Create club page tests

    def _test_open_chat_button(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//img[@alt='Open Chats']")
        self.browser.find_element_by_xpath("//img[@alt='Open Chats']").click()
        self.browser.implicitly_wait(10)
        # self.wait_until_element_found("//img[@alt='Send Icon']")
        sleep(2) #maybe wait for send messages text or something
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/chat/")

    def _test_open_profile_page(self, url): #data-testid="PersonIcon"
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[@class='dropdown-toggle btn btn-secondary']")
        self.browser.find_element_by_xpath("//button[@class='dropdown-toggle btn btn-secondary']").click()
        sleep(3)
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/user_profile/']")
        self.browser.find_element_by_xpath("//a[@href='/user_profile/']").click()
        self.browser.implicitly_wait(10)
        sleep(2) #maybe wait for send messages text or something
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")

    def _test_log_out_button(self, url): #data-testid="PersonIcon"
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[@class='dropdown-toggle btn btn-secondary']")
        self.browser.find_element_by_xpath("//button[@class='dropdown-toggle btn btn-secondary']").click()
        sleep(3)
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/log_out/']")
        self.browser.find_element_by_xpath("//a[@href='/log_out/']").click()
        self.browser.implicitly_wait(10)
        sleep(2) #maybe wait for send messages text or something
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/")

    def _test_open_meetings_page(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/meetings/']")
        self.browser.find_element_by_xpath("//a[@href='/meetings/']").click()
        self.browser.implicitly_wait(10)
        sleep(2) #maybe wait for send messages text or something
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/meetings/")

    def _test_open_user_profile_button(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/user_profile/']")
        self.browser.find_element_by_xpath("//a[@href='/user_profile/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Edit Profile']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")

    # Home Feed
    def _test_reply_to_comment_on_post(self):
        number_of_replies_before = Reply.objects.all().count()
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        posts = self.browser.find_elements_by_xpath("//div[@class='SingleFeedPost']")
        first_post = posts[0]
        first_post_view_all_comments_button = first_post.find_element_by_name("open_comments_button")
        first_post_id = first_post_view_all_comments_button.get_attribute("id").replace("toggler", "")
        first_post_view_all_comments_button.click()
        self.wait_until_element_found("//div[@class='singleComment']", 30)
        comments = first_post.find_elements_by_xpath(".//div[@class='singleComment']")
        first_comment = comments[0]
        first_comment.find_element_by_xpath(".//button[.='Reply']").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        first_comment.find_element_by_name("myReply").send_keys("New Reply To Comment")
        first_comment.find_element_by_xpath("//p[.=' Send ']").click()
        self.browser.implicitly_wait(10)
        sleep(10)
        number_of_replies_after = Reply.objects.count()
        self.assertEquals(number_of_replies_after, number_of_replies_before + 1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/")

    def _test_comment_on_post(self):
        number_of_comments_before = Comment.objects.count()
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        posts = self.browser.find_elements_by_xpath("//div[@class='SingleFeedPost']")
        first_post = posts[0]
        first_post_view_all_comments_button = first_post.find_element_by_name("open_comments_button")
        first_post_id = first_post_view_all_comments_button.get_attribute("id").replace("toggler", "")
        first_post_view_all_comments_button.click()
        self.wait_until_element_found("//div[@class='singleComment']", 30)
        self.browser.find_element_by_name("myComment").send_keys("New Comment")
        send_buttons = first_post.find_elements_by_xpath(".//p[.=' Send ']")
        send_buttons[-1].click()
        sleep(10)
        number_of_comments_after = Comment.objects.count()
        self.assertEqual(number_of_comments_after, number_of_comments_before + 1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/")

    def _test_like_post(self):
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        posts = self.browser.find_elements_by_xpath("//div[@class='SingleFeedPost']")
        first_post = posts[0]
        first_post_view_all_comments_button = first_post.find_element_by_name("open_comments_button")
        first_post_id = first_post_view_all_comments_button.get_attribute("id").replace("toggler", "")
        post = Post.objects.get(pk=first_post_id)
        number_of_likes_before = post.upvotes.count()
        sleep(5)
        first_post.find_element_by_name("like-button").click()
        sleep(5)
        number_of_likes_after = post.upvotes.count()
        print(number_of_likes_before)
        print(number_of_likes_after)
        self.assertNotEqual(number_of_likes_after, number_of_likes_before)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/")

    # Home Sidepanel
    def _test_home_page_see_all_your_recommendations_button(self):
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found('//text[.="See all recommendations"]')
        self.browser.find_element(by=By.XPATH, value='//text[.="See all recommendations"]').click()
        sleep(3)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/recommendations/")

    def _test_home_page_see_all_club_recommendations_button(self):
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found('//text[.="See all club recommendations"]')
        self.browser.find_element(by=By.XPATH, value='//text[.="See all club recommendations"]').click()
        sleep(3) 
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/recommend_clubs")

    def _test_home_page_see_all_clubs_button(self):
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found('//text[.="See all clubs"]')
        self.browser.find_element(by=By.XPATH, value='//text[.="See all clubs"]').click()
        sleep(3) 
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/all_clubs")

    def _test_home_page_recommended_book(self):
        self.browser.get(f"{self.live_server_url}/home")
        sleep(20)
        self.browser.refresh()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//div[@name="recommended-book"]', 40)
        recommended_book = self.browser.find_element_by_name("recommended-book")
        recommended_book_url = recommended_book.find_element_by_tag_name("a")
        recommended_book_href = recommended_book_url.get_attribute("href")
        recommended_book_url.click()
        self.browser.implicitly_wait(15)
        sleep(3)
        self.assertEqual(self.browser.current_url, f"{recommended_book_href}/")

    def _test_home_page_recommended_club(self):
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found('//a[@name="recommended-club"]')
        recommended_club = self.browser.find_element_by_name("recommended-club")
        recommended_club_href = recommended_club.get_attribute("href")
        recommended_club.click()
        self.browser.implicitly_wait(15)
        sleep(3)
        self.assertEqual(self.browser.current_url, f"{recommended_club_href}/" )

    # Clubs recommendations?

    def _test_create_club(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.find_element_by_xpath("//img[@alt='New Club Button']").click() 
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/create_club/")
        number_of_clubs_before = Club.objects.count()
        number_of_chats_before = Chat.objects.count()
        self.browser.find_element_by_name("name").send_keys(self.new_club_data['name']) 
        self.browser.find_element_by_id("description").send_keys(self.new_club_data['description'])
        sleep(2)
        create_club_button = self.browser.find_element_by_xpath("//button[.='Create']")
        self.browser.implicitly_wait(10)
        self.actions.move_to_element(create_club_button).click(create_club_button).perform()
        self.browser.implicitly_wait(10)
        sleep(2)
        number_of_clubs_after = Club.objects.count()
        number_of_chats_after = Chat.objects.count()
        self.assertEqual(number_of_clubs_after, number_of_clubs_before+1)
        self.assertEqual(number_of_chats_after, number_of_chats_before+1)
        # self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/") # Broken on frontend


    def _test_book_profile_see_your_recommendations_button(self):
        self.browser.get(f"{self.live_server_url}/book_profile/{self.book.pk}")
        sleep(2)
        self.browser.find_element(by=By.XPATH, value='//button[.="See your recommendations"]').click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/recommendations")


    def _test_book_profile_update_book_rating(self):
        book_object_rating_exists = BookRating.objects.filter(
            book_id=self.book.pk , user_id=self.user.pk).exists()
        if(not book_object_rating_exists):
            BookRating.objects.create(
                user=self.user,
                book=self.book,
                rating=5,
                )
            book_object_rating_exists = BookRating.objects.filter(
                book_id=self.book.pk , user_id=self.user.pk).exists()
        self.assertTrue(book_object_rating_exists)
        new_book_rating = 9
        self.browser.get(f"{self.live_server_url}/book_profile/{self.book.pk}")
        sleep(3)
        old_book_rating = self._get_book_rating_from_current_book_profile()
        
        self.browser.find_element(by=By.XPATH, value='//span[@data-index="4"]').click()
        self.browser.find_element(by=By.XPATH, value='//button[.="Update rating"]').click()
        sleep(2)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/book_profile/{self.book.pk}/")
        book_rating = self._get_book_rating_from_current_book_profile()
        book_object_rating = BookRating.objects.get(
            book_id=self.book.pk , user_id=self.user.pk).rating
        self.assertNotEqual(book_rating, old_book_rating)
        self.assertEqual(book_rating, new_book_rating)
        self.assertEqual(book_rating, book_object_rating)

    def _test_book_profile_rate_book(self):
        book_object_rating_exists = BookRating.objects.filter(
            book_id=self.book.pk , user_id=self.user.pk).exists()
        if(book_object_rating_exists):
            BookRating.objects.get(
                book_id=self.book.pk , user_id=self.user.pk).delete()
            book_object_rating_exists = BookRating.objects.filter(
                book_id=self.book.pk , user_id=self.user.pk).exists()
        self.assertFalse(book_object_rating_exists)
        new_book_rating = 7
        self.browser.get(f"{self.live_server_url}/book_profile/{self.book.pk}")
        sleep(3) 
        self.browser.find_element(by=By.XPATH, value='//span[@data-index="1"]').click() 
        self.browser.find_element(by=By.XPATH, value='//span[@data-index="3"]').click()
        self.browser.find_element(by=By.XPATH, value='//button[.="Submit rating"]').click()
        sleep(2)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/book_profile/{self.book.pk}/")
        book_object_rating_exists = BookRating.objects.filter(
            book_id=self.book.pk , user_id=self.user.pk).exists()
        self.assertTrue(book_object_rating_exists)
        book_rating = self._get_book_rating_from_current_book_profile()
        book_object_rating = BookRating.objects.get(
            book_id=self.book.pk , user_id=self.user.pk).rating
        self.assertEqual(book_rating, new_book_rating)
        self.assertEqual(book_rating, book_object_rating)

        

    def _test_book_profile_page_contains_correct_information(self):
        self.browser.get(f"{self.live_server_url}/book_profile/{self.book.pk}")
        sleep(3) 
        book_image_url = self.browser.find_element(by=By.CLASS_NAME, value="card-img-top").get_attribute('src')
        book_title = self.browser.find_element(by=By.CLASS_NAME, value="card-title").text
        page_subtitle_elements = self.browser.find_elements(by=By.CLASS_NAME, value="card-subtitle")
        book_author = (page_subtitle_elements[0].text).split(" ", 1)[1]
        book_date = (page_subtitle_elements[1].text).split(" ", 1)[1]
        book_genre = (page_subtitle_elements[2].text).split(" ", 1)[1]
        book_publisher = (page_subtitle_elements[3].text).split(" ", 1)[1]

        self.assertEqual(book_image_url, self.book.image_links_large)
        self.assertEqual(book_title, self.book.title)
        self.assertEqual(book_author, self.book.author)
        self.assertEqual(book_date, str(self.book.publication_date))
        self.assertEqual(book_genre, self.book.genre)
        self.assertEqual(book_publisher, self.book.publisher)

        book_rating = self._get_book_rating_from_current_book_profile()
        book_object_rating_exists = BookRating.objects.filter(
            book_id=self.book.pk , user_id=self.user.pk).exists()
        if(book_object_rating_exists):
            book_object_rating = BookRating.objects.get(
                book_id=self.book.pk , user_id=self.user.pk).rating
            self.assertEqual(book_rating, book_object_rating)
        else:
            self.assertEqual(book_rating, 0)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/book_profile/{self.book.pk}/")

    def _get_book_rating_from_current_book_profile(self):
        # Assumes you are already in the book profile page
        total_stars = 0
        stars = self.browser.find_elements(by=By.XPATH, value='//span[.="★"]')
        for star in stars:
            if("react-stars-" in star.get_attribute('class')):
                total_stars += 1
            elif("gray" not in star.get_attribute('style')):
                total_stars += 2
        return total_stars
        
        

    def _test_all_clubs_page_visit_club_profile(self):
        self.browser.get(f"{self.live_server_url}/all_clubs")
        self.wait_until_element_found("//button[.='Visit Profile']")

        club_card = self.browser.find_elements_by_class_name("card-body")[0]
        club_card_a_element = club_card.find_element(by=By.XPATH, value=".//a[contains(@href, '/club_profile/')]")
        club_card_href = club_card_a_element.get_attribute('href')
        club_card_id = club_card_href.split('/')[-1]

        club_card_visit_profile_button = club_card.find_element(by=By.XPATH, value=".//button[.='Visit Profile']")
        club_card_visit_profile_button.click()
        sleep(2)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/club_profile/{club_card_id}")


    def _test_all_clubs_page_contains_all_clubs(self):
        self.browser.get(f"{self.live_server_url}/all_clubs")
        self.wait_until_element_found("//button[.='Visit Profile']")
        id_to_club_object = {}
        all_visible_clubs = list(Club.objects.filter(public=True, visibility=True)) #list(Club.objects.all())#list(Club.objects.filter(visibility=True))
        for club in all_visible_clubs:
            id_to_club_object[club.id] = club

        body_text = self.browser.find_element(by=By.TAG_NAME, value="body").text
        print(body_text)

        club_cards = self.browser.find_elements_by_class_name("card-body")
        print("all_clubs1")
        self.assertEqual(len(club_cards), len(all_visible_clubs))
        for club_card in club_cards:
            club_card_club_name = club_card.find_element(by=By.CLASS_NAME, value="card-title").text
            club_card_number_of_members_string = club_card.find_element(by=By.CLASS_NAME, value="card-subtitle").text
            club_card_number_of_members = int(club_card_number_of_members_string.split(' ')[0])
            club_card_a_element = club_card.find_element(by=By.XPATH, value=".//a[contains(@href, '/club_profile/')]")
            club_card_href = club_card_a_element.get_attribute('href')
            club_card_id = club_card_href.split('/')[-1]
            club_object = id_to_club_object.pop(int(club_card_id))
            self.assertEqual(club_card_club_name, club_object.name)
            print("all_clubs2")
            self.assertEqual(club_card_number_of_members, club_object.members.count())
            print("all_clubs3")
            
        self.assertFalse(id_to_club_object)


    def _test_search_bar_find_user(self, url):
        user = User.objects.get(username="Val")
        self.browser.get(f"{self.live_server_url}/{url}")
        self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.find_element_by_name("search-bar-input").send_keys("Va")
        self.browser.find_element_by_name("search-bar-button").click()
        self.wait_until_element_found("//text[.='%s']" % user.username)
        self.browser.find_element_by_xpath("//text[.='%s']" % user.username).click()
        sleep(3) 
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/{user.pk}/")

    def _test_search_bar_find_club(self, url):
        club_name = self.club.name
        self.browser.get(f"{self.live_server_url}/{url}")
        self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.find_element_by_name("search-bar-input").send_keys("Kerbal")
        self.browser.find_element_by_name("search-bar-button").click()
        self.wait_until_element_found("//text[.='%s']" % club_name)
        self.browser.find_element_by_xpath("//text[.='%s']" % club_name).click()
        sleep(3) 
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/club_profile/{self.club.pk}/")

    def _test_search_bar_find_book(self, url):
        book_name = self.book.title
        half_of_book_name = book_name[:len(book_name)//2]
        self.browser.get(f"{self.live_server_url}/{url}")
        self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.find_element_by_name("search-bar-input").send_keys(half_of_book_name)
        self.browser.find_element_by_name("search-bar-button").click()
        self.wait_until_element_found("//text[.='%s']" % book_name)
        self.browser.find_element_by_xpath("//text[.='%s']" % book_name).click()
        sleep(3)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/book_profile/{self.book.pk}/")

    def _test_user_profile_posts_tab_contains_correct_information(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Posts']").click()
        self.wait_until_element_found("//i[normalize-space()='@%s']" % self.user.username)
        body_text = self.browser.find_element_by_tag_name("body").text
        user_posts = self.user.posts.values()
        for post in user_posts:
            self.assertTrue(post['title'] in body_text)
            post_content = post['content'].replace('\n', ' ')
            self.assertTrue(post_content in body_text)

    def _test_user_profile_user_profile_cotains_correct_information(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.wait_until_element_found("//i[normalize-space()='@%s']" % self.user.username)
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue(self.user.first_name in body_text)
        self.assertTrue(self.user.last_name in body_text)
        self.assertTrue(self.user.username in body_text)
        self.assertTrue(self.user.location in body_text)
        self.assertTrue(self.user.bio in body_text)

    def _test_edit_user_profile(self):
        bio_before = self.user.bio
        location_before = self.user.location
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.implicitly_wait(15)
        self.wait_until_element_found("//button[.='Edit Profile']")
        print("AYO")
        self.browser.find_element_by_xpath("//button[.='Edit Profile']").click()
        print("AYO2")
        self.wait_until_element_found("//textarea[@id='bio']")
        print("EDITUSERAFTERPROFILE")
        self.browser.find_element_by_id('bio').click()
        self.browser.find_element_by_id('bio').send_keys(" Edit Bio.")
        self.browser.find_element_by_id('location').send_keys(" Edit Location.")
        self.browser.find_element_by_xpath("//button[.='Save changes']").click()
        sleep(2)
        edited_user = User.objects.get(pk=self.user.pk)
        print(edited_user.bio)
        print(edited_user.location)
        self.assertNotEqual(bio_before, edited_user.bio)
        self.assertNotEqual(location_before, edited_user.location)

    def _test_user_profile_suggested_friends(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        sleep(8)
        self.browser.get(f"{self.live_server_url}/user_profile/")
        self.wait_until_element_found("//div[@name='suggested-friend']", 30)
        suggested_user = self.browser.find_element_by_name("suggested-friend")
        suggested_user_name = suggested_user.text
        suggested_user.click()
        user = User.objects.get(username=suggested_user_name)
        sleep(4)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/{user.pk}/")

    def _test_delete_friend(self):
        number_of_friends_before = len(self.user.friends.all())
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//text[.='Friends']").click()
        self.browser.implicitly_wait(10)
        sleep(1)
        self.wait_until_element_found("//div[@class='friend']")
        friend_card = self.browser.find_element_by_xpath("//div[@class='friend']")
        friend_card.find_element_by_xpath(".//button[.='X']").click() 
        sleep(2)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        number_of_friends_after = len(self.user.friends.all())
        self.assertEqual(number_of_friends_before - 1, number_of_friends_after)

    def _test_accept_friend_request(self):
        number_of_friend_requests_before = FriendRequest.objects.count()
        number_of_friends_before = len(self.user.friends.all())
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Friends']").click()
        sleep(1)
        self.browser.find_element_by_id("friendRequestToggler").click()
        sleep(1)
        self.browser.find_element_by_xpath("//p[.=' Accept ']").click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        number_of_friend_requests_after = FriendRequest.objects.count()
        number_of_friends_after = len(self.user.friends.all())
        self.assertEqual(number_of_friend_requests_before - 1, number_of_friend_requests_after)
        self.assertEqual(number_of_friends_before + 1, number_of_friends_after)

    def _test_reject_friend_request(self):
        number_of_friend_requests_before = FriendRequest.objects.count()
        number_of_friends_before = len(self.user.friends.all())
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Friends']").click()
        sleep(1)
        self.browser.find_element_by_id("friendRequestToggler").click()
        sleep(1)
        self.browser.find_element_by_xpath("//p[.=' Reject ']").click()
        sleep(2)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        number_of_friend_requests_after = FriendRequest.objects.count()
        number_of_friends_after = len(self.user.friends.all())
        self.assertEqual(number_of_friend_requests_before - 1, number_of_friend_requests_after)
        self.assertEqual(number_of_friends_before, number_of_friends_after)

    def _test_edit_post(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Posts']").click()
        sleep(1)
        self.wait_until_element_found('//div[@class="personalPost"]')
        self.browser.find_element_by_xpath("//button[.='Edit']").click()
        self.browser.find_element_by_name("title").send_keys(" Edited.")
        self.browser.find_element_by_name("content").send_keys(" Edited.")
        self.browser.find_element_by_xpath("//button[.='Save']").click()
        sleep(2)
        self.wait_until_element_found('//div[@class="personalPost"]')
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        body_text = self.browser.find_element_by_tag_name("body").text
        self.assertTrue("Edited" in body_text)

    def _test_delete_post(self):
        number_of_posts_before = Post.objects.count()
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.implicitly_wait(10)
        self.browser.find_element_by_xpath("//text[.='Posts']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//div[@class="personalPost"]')
        self.wait_until_element_found("//button[.='X']")
        post_card = self.browser.find_element_by_class_name("card")
        post_card.find_element_by_xpath(".//button[.='X']").click()
        sleep(2)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        number_of_posts_after = Post.objects.count()
        self.assertEqual(number_of_posts_before - 1, number_of_posts_after)


    def _test_chat_page(self):
        self.browser.get(f"{self.live_server_url}/chat/")
        all_contacts = self.browser.find_elements_by_xpath("//a[@test-name='contact-card']")
        print(len(all_contacts))
        first_chat_contact = all_contacts[0]
        first_chat_contact_href = first_chat_contact.get_attribute("href")
        first_chat_contact.click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{first_chat_contact_href}")
        sleep(10)

    def _test_password_reset(self):
        new_password = "NewPassword123"
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.browser.get(f"{self.live_server_url}/password_reset")
        self.browser.find_element_by_name("email").send_keys(self.user.email)
        self.browser.find_element_by_xpath('//button[.="Send Reset Email"]').click()
        self.wait_until_element_found('//a[.="Landing page"]')
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/password_reset/instructions_sent")
        self.browser.find_element_by_xpath('//a[.="Landing page"]').click()
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/")
        sleep(1)
        email_lines = mail.outbox[0].body.splitlines()
        reset_link = [l for l in email_lines if "/password_reset_confirm/" in l][0]
        uid, token = reset_link.split("/")[-2:]
        print(reset_link)
        self.browser.get(f"{self.live_server_url}/password_reset_confirm/{uid}/{token}")
        self.browser.find_element_by_name("new_password").send_keys(new_password)
        self.browser.find_element_by_name("re_new_password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Reset"]').click() 
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")

    # Helpers
    def _log_in(self):
        self.browser.get(f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Log In']")
        log_in_button = self.browser.find_element_by_xpath("//button[.='Log In']")
        username_input = self.browser.find_element_by_name("username")
        password_input = self.browser.find_element_by_name("password")
        username_input.send_keys(self.login_data['username'])
        password_input.send_keys(self.login_data['password'])
        log_in_button.click()
        sleep(3)
        self.browser.implicitly_wait(10)
        self.assertNotEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")

    def _log_in_user_without_ratings(self):
        self.browser.get(f"{self.live_server_url}/log_in/")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Log In']")
        log_in_button = self.browser.find_element_by_xpath("//button[.='Log In']")
        username_input = self.browser.find_element_by_name("username")
        password_input = self.browser.find_element_by_name("password")
        username_input.send_keys(self.user_without_ratings.username)
        password_input.send_keys("Password123")
        log_in_button.click()
        sleep(5)
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//span[@data-index='3']", 40)
        self.assertNotEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")

    def wait_until_element_found(self, xpath, time=15):
        WebDriverWait(self.browser, timeout=time).until(
            lambda x: self.browser.find_element_by_xpath(xpath)
        )

    def _close_db_connections(self):
        for conn in connections.all():
            conn.close()
        connections.close_all()
    
    def _seed_additional_friend_requests(self, user):
        potential_non_friends = get_n_random_non_friends(10, user)
        for non_friend in potential_non_friends:
            print(non_friend)
            non_friend.send_friend_request(user)
        print(f"Number of friend requests for {user}: {FriendRequest.objects.filter(receiver=user).count()}")

    def _seed_additional_club_users(self, club):
        while(club.admins.count() < 4):
            user = get_user()
            if not self._is_in_club(club, user) :
                club.add_member(user)
                club.promote(user)
                print(user)

        while(club.members.count() < 4):
            user = get_user()
            if not self._is_in_club(club, user):
                club.add_member(user)
                print(user)

        while(club.applicants.count() < 4):
            user = get_user()
            if not self._is_in_club(club, user):
                club.add_applicant(user)
                print(user)

    def _is_in_club(self, club, user):
        is_in_club = False
        is_in_club = is_in_club or user in club.applicants.all()
        is_in_club = is_in_club or user in club.members.all()
        is_in_club = is_in_club or user in club.admins.all()
        is_in_club = is_in_club or user == club.owner
        return is_in_club
