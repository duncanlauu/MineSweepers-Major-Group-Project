from time import sleep
from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.conf import settings
from django.test import override_settings
from app.models import FriendRequest, User, Club, Chat, Book, Post, BookRating, Comment, Reply
from django.core.management import call_command
from django.core import mail

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, generate_pred_set, train_model, test_model, dump_trained_model, load_trained_model
from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users, seed_default_objects, \
    seed_friends, seed_friend_requests, seed_meetings, seed_feed, seed_messages, print_info, get_n_random_non_friends, \
        get_n_random_users, get_user
from surprise import SVD

from django.db import connections
from django.db import close_old_connections
from django import db

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
            # chrome_options.headless = True
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--window-size=1200,800")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--allow-insecure-localhost")

        #for headless testing
        # chrome_options.headless = True
        # chrome_options.add_argument("--headless")
        # chrome_options.add_argument("--window-size=1200,800")
        # if not cls.SHOW_BROWSER:
        #     chrome_options.add_argument("--headless")
        #     chrome_options.add_argument("--window-size=1200,800")

        # ChromeOptions options = new ChromeOptions();
        # options.addArguments("--headless");
        # options.addArguments("--disable-gpu");
        # options.addArguments("--no-sandbox");
        # options.addArguments("--allow-insecure-localhost");

        # var chromeOptions = new ChromeOptions();                        
        # chromeOptions.AddArguments("--headless");
        # chromeOptions.AddArguments("--disable-gpu");
        # chromeOptions.AddArguments("--window-size=1280,800");
        # chromeOptions.AddArguments("--allow-insecure-localhost");

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

        # # Train the recommender system model
        # self.csv_file_path = 'app/files/BX-Book-Ratings-filtered.csv'
        # self.dump_file_path = 'app/files/dump_file'
        # self.dataframe = get_combined_data(self.csv_file_path)
        # self.data = get_dataset_from_dataframe(self.dataframe)
        # self.trainset = get_trainset_from_dataset(self.data)
        # self.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
        # train_model(self.algo, self.trainset)
        # self.pred = test_model(self.algo, self.trainset)
        # dump_trained_model(self.dump_file_path, self.algo, self.pred)

        # The user used for testing
        self.user = User.objects.get(username='Jeb')
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

        print("NUMBER OF FRIEND REQUESTS")
        print(FriendRequest.objects.filter(receiver=self.user).count())

        potential_non_friends = get_n_random_non_friends(10, self.user)
        for non_friend in potential_non_friends:
            print(non_friend)
            non_friend.send_friend_request(self.user)

        print("NUMBER OF FRIEND REQUESTS")
        print(FriendRequest.objects.filter(receiver=self.user).count())

        while(self.club.admins.count() < 4):
            user = get_user()
            if not self._is_in_club(self.club, user) :
                self.club.add_member(user)
                self.club.promote(user)
                print(user)

        while(self.club.members.count() < 4):
            user = get_user()
            if not self._is_in_club(self.club, user):
                self.club.add_member(user)
                print(user)

        while(self.club.applicants.count() < 4):
            user = get_user()
            if not self._is_in_club(self.club, user):
                self.club.add_applicant(user)
                print(user)


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

    def _is_in_club(self, club, user):
        is_in_club = False
        is_in_club = is_in_club or user in club.applicants.all()
        is_in_club = is_in_club or user in club.members.all()
        is_in_club = is_in_club or user in club.admins.all()
        is_in_club = is_in_club or user == club.owner
        return is_in_club

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
        
        # Log out
        self.browser.get(f"{self.live_server_url}/log_out")
        self._close_db_connections()

    def test_everything(self):
        # self._log_in()
        # sleep(200)

        # # Landing Page # DONE
        # self.run_testcase(self._test_boogkle_logo_redirects_to_landing_page, False, "")
        # self.run_testcase(self._test_landing_page_log_in_button, False)
        # self.run_testcase(self._test_landing_page_sign_up_button, False)

        # # Log In Page # DONE
        # self.run_testcase(self._test_boogkle_logo_redirects_to_landing_page, False, "log_in")
        # self.run_testcase(self._text_sign_up_here_button_redirects_to_sign_up, False)
        # self.run_testcase(self._test_forgot_password_button_redirects_to_password_reset, False)
        # self.run_testcase(self._test_log_in_with_wrong_password, False)
        # self.run_testcase(self._test_log_in, False)

        # # Sign Up Page # DONE
        # self.run_testcase(self._test_boogkle_logo_redirects_to_landing_page, False, "sign_up")
        # self.run_testcase(self._test_log_in_here_button_redirects_to_log_in, False)
        # self.run_testcase(self._test_sign_up_with_blank_fields, False)
        # self.run_testcase(self._test_sign_up_username_too_short, False)
        # self.run_testcase(self._test_sign_up_invalid_email, False)

        # # Sign Up Page and new user Book Rating Page # DONE
        # self.run_testcase(self._test_sign_up_and_book_rating, False)

        # # Home Page
        # self.page_contains_functional_navbar("home")
        # self.run_testcase(self._test_reply_to_comment_on_post, True)
        # self.run_testcase(self._test_comment_on_post, True)
        # self.run_testcase(self._test_like_post, True)
        # self.run_testcase(self._test_home_page_see_all_your_recommendations_button, True)

        # # Search Bar
        # self.run_testcase(self._test_search_bar_find_user, True, "all_clubs")
        # self.run_testcase(self._test_search_bar_find_club, True, "all_clubs") # Broken on frontend when clicking on search button
        # self.run_testcase(self._test_search_bar_find_book, True, "all_clubs")
        # # self.run_testcase(self._test_navbar_new_post, True, "all_clubs") # Probably broken # CAN BE DELETED OR REPLACED FOR ONE WHERE WE ADD CLUB ID
        # # self.run_testcase(self._test_navbar_create_club, True, "all_clubs")  # Probably broken # Broken redirect on front end

        # # User Page
        # self.page_contains_functional_navbar("user_profile")
        # self.run_testcase(self._test_user_profile_user_profile_cotains_correct_information, True)
        # #self.run_testcase()# EDIT BUTON TEST HERE
        # self.run_testcase(self._test_user_profile_posts_tab_contains_correct_information, True)
        # self.run_testcase(self._test_edit_post, True)
        # self.run_testcase(self._test_delete_post, True)
        # self.run_testcase(self._test_accept_friend_request, True) # BROKEN
        # self.run_testcase(self._test_reject_friend_request, True) # BROKEN
        # self.run_testcase(self._test_delete_friend, True)
        # self.run_testcase(self._test_user_profile_suggested_friends, True)

        # Club Profile Page
        
        # self.page_contains_functional_navbar(f"club_profile/{self.club.pk}/")
        # self.run_testcase(self._test_club_profile_contains_correct_information , True)
        # self.run_testcase(self._test_club_feed_tab_contains_correct_information , True)
        # # Contains corect book history
        # self.run_testcase(self._test_members_tab_contains_correct_information, True)

        # self._test_club_profile_contains_correct_information()
        # self._test_club_feed_tab_contains_correct_information()
        # self._test_apply_to_club() # apply to club where not member
        # self._test_members_tab_contains_correct_information()
        # Accept applicant
        # Reject applicant
        # Remove member
        # Ban member
        # Make owener out of officer
        # Ban officer
        # self._test_feed_tab_contains_correct_information()
        # self._test_meetings_tab() # Meeting history not implemented yet
        # self._test_schedule_a_meeting() #needs recommender system trained

        # As Owner
        self.run_testcase(self._test_promote_member_to_admin_as_owner, True)
        self.run_testcase(self._test_demote_admin_to_member_as_owner, True)
        self.run_testcase(self._test_ban_member_as_owner, True)
        self.run_testcase(self._test_ban_admin_as_owner, True)
        self.run_testcase(self._test_unban_banned_user_as_owner, True)
        self.run_testcase(self._test_remove_member_as_owner, True)
        self.run_testcase(self._test_transfer_ownership_to_admin_and_leave_club, True)

        # As Admin
        # Test that there are no make owner, promote, demote buttons
        self.run_testcase(self._test_remove_member_as_admin, True)
        self.run_testcase(self._test_ban_member_as_admin, True)
        self.run_testcase(self._test_unban_banned_user_as_admin, True)
        
        # As Member
        # Test that there are no make owner, promote 

        # As Non-Member



        # add one for can't apply to club where member

        # # # All Clubs Page
        # self.page_contains_functional_navbar("all_clubs")
        # self.run_testcase(self._test_all_clubs_page_contains_all_visible_clubs, True)
        # self.run_testcase(self._test_all_clubs_page_visit_club_profile, True)
        
        # # # Book Profile Page
        # self.page_contains_functional_navbar(f"book_profile/{self.book.pk}")
        # self.run_testcase(self._test_book_profile_page_contains_correct_information, True)
        # self.run_testcase(self._test_book_profile_rate_book, True)
        # self.run_testcase(self._test_book_profile_update_book_rating, True)
        # self.run_testcase(self._test_book_profile_see_your_recommendations_button, True)

        # # # Password Reset
        # self.run_testcase(self._test_password_reset, False)

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

    # Page Contains Functional Navbar
    def page_contains_functional_navbar(self, url):
        self.run_testcase(self._test_boogkle_logo_redirects_to_home_when_logged_in, True, url)
        self.run_testcase(self._test_open_and_close_search_bar, True, url)
        self.run_testcase(self._test_navbar_create_new_post, True, url)
        self.run_testcase(self._test_new_club_button_redirects_to_create_club, True, url)
        self.run_testcase(self._test_open_chat_button, True, url)
        # self._test_log_out_button(url)

    # Club Profile Page as Admin

    def _test_unban_banned_user_as_admin(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Unban" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Unban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        # Check he is removed
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    def _test_ban_member_as_admin(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Remove" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Ban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        # Check he is removed
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    def _test_remove_member_as_admin(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Remove" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Remove"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club_where_admin.pk}/")
        # Check he is removed
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    # Club Profile Page as Owner

    def _test_unban_banned_user_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Unban" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Unban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        # Check he is removed
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    def _test_remove_member_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Promote" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Remove"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        # Check he is removed
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    def _test_ban_admin_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        admin_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Demote" in club_user_card_text):
                admin_club_user_card = club_user_card
                break
        new_demoted_user = admin_club_user_card.find_element_by_name("username-text").text
        print("admin_club_user: ", new_demoted_user)
        admin_club_user_card.find_element_by_xpath('.//button[.="Ban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        sleep(1)
        # Check he is banned
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)
        

    def _test_ban_member_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Promote" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Ban"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        # Check he is banned
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    def _test_promote_member_to_admin_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        member_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Promote" in club_user_card_text):
                member_club_user_card = club_user_card
                break
        new_admin_username = member_club_user_card.find_element_by_name("username-text").text
        print("member_club_user: ", new_admin_username)
        member_club_user_card.find_element_by_xpath('.//button[.="Promote"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        # Check he is admin
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)

    def _test_demote_admin_to_member_as_owner(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        admin_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Demote" in club_user_card_text):
                admin_club_user_card = club_user_card
                break
        new_demoted_user = admin_club_user_card.find_element_by_name("username-text").text
        print("admin_club_user: ", new_demoted_user)
        admin_club_user_card.find_element_by_xpath('.//button[.="Demote"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        sleep(1)
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(2)
        

    def _test_transfer_ownership_to_admin_and_leave_club(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.browser.implicitly_wait(10)
        # Check that there is no leave button
        self.browser.find_element_by_xpath('//button[.="Members"]').click()
        sleep(1)
        club_user_cards = self.browser.find_elements_by_name("individual-user-card")
        admin_club_user_card = None
        for club_user_card in club_user_cards:
            club_user_card_text = club_user_card.text
            print(club_user_card_text)
            if("Make Owner" in club_user_card_text):
                admin_club_user_card = club_user_card
                break
        new_owner_username = admin_club_user_card.find_element_by_name("username-text").text
        print("admin_club_user: ", new_owner_username)
        admin_club_user_card.find_element_by_xpath('.//button[.="Make Owner"]').click()
        sleep(1)
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        sleep(1)
        self.wait_until_element_found('//button[.="Leave Club"]')
        self.browser.find_element_by_xpath('//button[.="Leave Club"]').click()
        sleep(3)
        # Check that the new owner is the new owner
        # Check db that left the club




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
        print(body_text)
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
        self.browser.implicitly_wait(10)
        sleep(1)
        number_of_users_after = User.objects.count()
        self.assertEqual(number_of_users_after, number_of_users_before+1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")
        self.wait_until_element_found("//span[@data-index='3']", 20)
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

    def _test_open_user_profile_button(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//a[@href='/user_profile/']")
        self.browser.find_element_by_xpath("//a[@href='/user_profile/']").click()
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[.='Edit Profile']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")

    # def _test_log_out_button(self, url): #Not Implemented in frontend
        # self.browser.get(f"{self.live_server_url}/{url}")
        # self.browser.find_element_by_xpath("//img[@alt='Log Out']").click()

    # Home Feed
    def _test_reply_to_comment_on_post(self): #Due to weird time delay, this test is not stable
        number_of_replies_before = Reply.objects.all().count()
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        posts = self.browser.find_elements_by_xpath("//div[@class='SingleFeedPost']")
        first_post = posts[0]
        first_post_view_all_comments_button = first_post.find_element_by_xpath(".//button[.='view all comments']")
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

    def _test_comment_on_post(self): #Due to weird time delay, this test is not stable
        number_of_comments_before = Comment.objects.count()
        self.browser.get(f"{self.live_server_url}/home")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        posts = self.browser.find_elements_by_xpath("//div[@class='SingleFeedPost']")
        first_post = posts[0]
        first_post_view_all_comments_button = first_post.find_element_by_xpath(".//button[.='view all comments']")
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
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//div[@class='SingleFeedPost']")
        posts = self.browser.find_elements_by_xpath("//div[@class='SingleFeedPost']")
        first_post = posts[0]
        first_post_view_all_comments_button = first_post.find_element_by_xpath(".//button[.='view all comments']")
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
        self.browser.implicitly_wait(10)
        self.wait_until_element_found('//text[.="See all recommendations"]')
        self.browser.find_element(by=By.XPATH, value='//text[.="See all recommendations"]').click()
        sleep(2) # wait for button
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/recommendations/")

    # Clubs recommendations?

    def _test_navbar_create_club(self, url): # BROKEN
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.find_element_by_xpath("//img[@alt='New Club Button']").click() # a real element name would be nice
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/create_club/")
        number_of_clubs_before = Club.objects.count()
        number_of_chats_before = Chat.objects.count()
        self.browser.find_element_by_name("name").send_keys(self.new_club_data['name']) #ID / NAME inconsistent
        self.browser.find_element_by_id("description").send_keys(self.new_club_data['description']) #ID / NAME inconsistent
        sleep(2)
        create_club_button = self.browser.find_element_by_xpath("//button[.='Create']")
        self.browser.implicitly_wait(10)
        self.actions.move_to_element(create_club_button).click(create_club_button).perform()

        # self.browser.find_element_by_xpath("//button[.='Create']").click()
        self.browser.implicitly_wait(10)
        number_of_clubs_after = Club.objects.count()
        number_of_chats_after = Chat.objects.count()
        self.assertEqual(number_of_clubs_after, number_of_clubs_before+1)
        self.assertEqual(number_of_chats_after, number_of_chats_before+1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home/")


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
        sleep(3) #replace with better
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
        sleep(3) #replace with better
        self.browser.find_element(by=By.XPATH, value='//span[@data-index="1"]').click() #click Clear button
        # self.browser.find_element(by=By.XPATH, value='//button[.="Clear"]').click() #only clickable when windows size is big enough
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
        sleep(3) #replace with better
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
        sleep(1) # maybe something better here
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/club_profile/{club_card_id}")


    def _test_all_clubs_page_contains_all_visible_clubs(self):
        self.browser.get(f"{self.live_server_url}/all_clubs")
        self.wait_until_element_found("//button[.='Visit Profile']")
        id_to_club_object = {}
        all_visible_clubs = list(Club.objects.filter(visibility=True))
        for club in all_visible_clubs:
            id_to_club_object[club.id] = club

        club_cards = self.browser.find_elements_by_class_name("card-body")
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
            self.assertEqual(club_card_number_of_members, club_object.members.count())
            
        self.assertFalse(id_to_club_object)

    def _test_club_feed_tab_contains_correct_information(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}")
        self.wait_until_element_found('//a[.="bookgle"]') # added later
        self.browser.find_element_by_xpath('//button[.="Feed"]').click()
        body_text = self.browser.find_element_by_tag_name("body").text
        club_posts = Post.objects.filter(club=self.club.pk).values()
        for post in club_posts:
            author_username = User.objects.get(pk=post['author_id']).username
            post_content = post['content'].replace('\n', ' ')
            self.assertTrue(author_username in body_text) 
            self.assertTrue(post['title'] in body_text)
            self.assertTrue(post_content in body_text)

    

    def _test_search_bar_find_user(self, url):
        user = User.objects.get(username="Val")
        self.browser.get(f"{self.live_server_url}/{url}")
        self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.find_element_by_name("search-bar-input").send_keys("Va")
        self.browser.find_element_by_name("search-bar-button").click()
        self.wait_until_element_found("//text[.='%s']" % user.username)
        self.browser.find_element_by_xpath("//text[.='%s']" % user.username).click()
        sleep(3) # wait to find
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/{user.pk}/")

    def _test_search_bar_find_club(self, url):
        club_name = self.club.name
        half_of_club_name = club_name[:len(club_name)//2]
        self.browser.get(f"{self.live_server_url}/{url}")
        self.browser.implicitly_wait(10)
        self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.find_element_by_name("search-bar-input").send_keys(half_of_club_name)
        self.browser.find_element_by_name("search-bar-button").click()
        self.wait_until_element_found("//text[.='%s']" % club_name)
        self.browser.find_element_by_xpath("//text[.='%s']" % club_name).click()
        sleep(2) # wait to find
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/club_profile/{self.club.pk}/")

    def _test_search_bar_find_book(self, url):
        book_name = self.book.title
        print(self.book)
        half_of_book_name = book_name[:len(book_name)//2]
        self.browser.get(f"{self.live_server_url}/{url}")
        self.wait_until_element_found("//button[@name='search-bar']")
        self.browser.find_element_by_name("search-bar").click()
        self.browser.find_element_by_name("search-bar-input").send_keys(half_of_book_name)
        self.browser.find_element_by_name("search-bar-button").click()
        self.wait_until_element_found("//text[.='%s']" % book_name)
        self.browser.find_element_by_xpath("//text[.='%s']" % book_name).click()
        sleep(2) # wait to find
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/book_profile/{self.book.pk}")


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
        # Check for user picture
        self.assertTrue(self.user.first_name in body_text)
        self.assertTrue(self.user.last_name in body_text)
        self.assertTrue(self.user.username in body_text)
        self.assertTrue(self.user.location in body_text)
        self.assertTrue(self.user.bio in body_text)


    def _test_members_tab_contains_correct_information(self):
        pass

    def _test_schedule_a_meeting(self):

        pass

    def _test_club_profile_contains_correct_information(self):
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/")
        self.wait_until_element_found('//a[.="bookgle"]') # added later
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        body_text = self.browser.find_element_by_tag_name("body").text
        print(body_text)
        self.assertTrue(self.club.name in body_text)
        #self.assertTrue(self.club.description in body_text) #broken on frontend
        # Test for correct club picture??
        # Test for reading History once implemented?
        # sleep(1)

    def _test_apply_to_club(self):
        # Apply only works when not part of the club
        # I don't think this has been implemented
        self.browser.get(f"{self.live_server_url}/club_profile/{self.club.pk}/") 
        self.wait_until_element_found('//a[.="bookgle"]') # added later
        self.browser.find_element_by_xpath('//button[.="Profile"]').click()
        self.browser.find_element_by_xpath('//button[.="Apply"]').click()
        self.wait_until_element_found('//button[.="Applied"]')
        # User added to applicants

        # self.browser.find_element_by_xpath('//button[.="Meetings"]').click()
        # self.browser.find_element_by_xpath('//button[.="Schedule a Meeting"]').click()
        # self.browser.find_element_by_xpath('//button[.="Members"]').click()

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
        self._close_db_connections()

    def _test_delete_friend(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Friends']").click()
        # sleep(15)
        self.browser.find_element_by_xpath("//button[.='X']").click() #probably getting the element from posts page thats why it doesnt work
        # can get user id from delete button maybe can be used when checking db
        sleep(1)

        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")

    def _test_accept_friend_request(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Friends']").click()
        sleep(1)
        self.browser.find_element_by_id("friendRequestToggler").click()
        sleep(1)
        self.browser.find_element_by_xpath("//p[.=' Accept ']").click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        # Check in db that user went down, maybe on website one less name

    def _test_reject_friend_request(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Friends']").click()
        sleep(1)
        self.browser.find_element_by_id("friendRequestToggler").click()
        sleep(1)
        self.browser.find_element_by_xpath("//p[.=' Reject ']").click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        # Check in db that friend requests went down, maybe on website one less name

    def _test_edit_post(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Posts']").click()
        sleep(1)
        self.browser.find_element_by_xpath("//button[.='Edit']").click()
        self.browser.find_element_by_name("title").send_keys(" Edited.")
        self.browser.find_element_by_name("content").send_keys(" Edited.")
        self.browser.find_element_by_xpath("//button[.='Save']").click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        # check db that it edited post

    def _test_delete_post(self):
        self.browser.get(f"{self.live_server_url}/user_profile")
        self.browser.find_element_by_xpath("//text[.='Posts']").click()
        sleep(1)
        self.browser.find_element_by_xpath("//button[.='X']").click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/user_profile/")
        # check db that it deleted post


    



    def _test_page_has_navbar(self, url):
        self.browser.get(f"{self.live_server_url}/{url}")
        pass
        # sleep(1)
        # body_text = self.browser.find_element_by_tag_name("body").text
        # print(body_text)
        # self.assertTrue("Invalid username/password" in body_text)

    def _test_page_does_not_have_navbar(self, url):
        pass
 
    

    def _test_logo_button_goes_to_landing_page_when_not_logged_in(self, url):
        # self.browser.get(f"{self.live_server_url}/")
        # self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        # self.wait_until_element_found("//button[.='Log In']")
        self.browser.get(f"{self.live_server_url}/{url}")
        logo_button = self.browser.find_element_by_xpath('//a[.="bookgle"]')
        logo_button.click()
        sleep(1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/")




    


    


    def _test_log_out(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
        # Navigate to LOG OUT with buttons (NOT Implemented in frontend yet?)
        self.browser.get(f"{self.live_server_url}/log_out")
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/")
        # Check that logged out??

    def _test_recommendations_page(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # Navigate to Recommendations page
        self.wait_until_element_found("//a[@href='/recommendations/']")
        self.browser.find_element_by_xpath("//a[@href='/recommendations/']").click()
        self.wait_until_element_found("//text[.='Books For You']") 
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/recommendations/")
        # Needs to be seeded for this to work but _test for recommendations ?
        # Maybe _test for response time also?

    # def _test_logo_navigates_to_home(self):
    #     pass

    # def _test_logo_in_log_in_navigates_to_log_in(self):
    #     pass

    # def _test_log_in_has_link_to_sign_up(self):
    #     pass

    # def _test_sign_up_has_link_to_log_in(self):
    #     pass

    # def _test_club_list(self):
    #     pass

    def _test_user_profile(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # Navigate to Friends Page with buttons (NOT Implemented in frontend yet?)
        self.browser.get(f"{self.live_server_url}/user_profile")

    # def _test_page_redicrects_to_log_in_when_not_logged_in(self):
    #     pass

    def _test_scheduling_page(self):
        pass

    def _test_chat_page(self):
        '''
        Unable to _test chat frontend functionality (Connecting to websocket) with selenium
        due to a python multihtreading error when running ChannelsLiveServerTestCase.
        https://github.com/django/channels/issues/1485 
        '''
        # Test navigation to page, selecting chats
        pass

    def _test_meetings_page(self):
        pass

    # def _test_recommend_clubs_page(self):
    #     # ???
    #     pass


    def _test_search_bar(self):
        pass

    def _test_404_page(self):
        # go to non_existent_url
        self.browser.get(f"{self.live_server_url}/non_existent_url")
        # find a link to homepage ? or home?
        pass

    def _test_password_reset(self):
        new_password = "NewPassword123"
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in/']")
        self.wait_until_element_found("//a[@href='/sign_up/']")
        self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # Denied, new password doesnt't work yet
        # Click on forgot password, passwrod reset
        self.browser.get(f"{self.live_server_url}/password_reset")
        self.browser.find_element_by_name("email").send_keys(self.user.email)
        self.browser.find_element_by_xpath('//button[.="Send Reset Email"]').click()

        # Wait to be redirected to email sent page or text of that sort to appear
        sleep(1)

        email_lines = mail.outbox[0].body.splitlines()
        reset_link = [l for l in email_lines if "/password_reset_confirm/" in l][0]
        uid, token = reset_link.split("/")[-2:]
        print(reset_link)
        self.browser.get(f"{self.live_server_url}/password_reset_confirm/{uid}/{token}")
        # Test for putting in different passwords
        self.browser.find_element_by_name("new_password").send_keys(new_password)
        self.browser.find_element_by_name("re_new_password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Reset"]').click() # Needs to be renamed!
        
        # Redirects to login?
        sleep(1)

        # Log in with new password
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        sleep(1)
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
        sleep(3) # Wait for page to load
        self.browser.implicitly_wait(10)
        self.assertNotEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        # make method to wait a little
        # self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")

# XPath is a very flexible and powerful tool. For example, you can:
# Select elements by ID: "//input[@id='id_title']"
# Select elements by any other attribute: "//div[@aria-label='Blank']"
# Select elements by innerText: "//button[.='Save']"
# Select elements by CSS class and innerText: "//button[contains(@class,'btn-primary')][.='Save']"
# Select the first element by innerText: "(//button[.='yes'])[1]"

    #from source: --

    def wait_until_element_found(self, xpath, time=15):
        WebDriverWait(self.browser, timeout=time).until(
            lambda x: self.browser.find_element_by_xpath(xpath)
        )

    def _close_db_connections(self):
        for conn in connections.all():
            conn.close()
        connections.close_all()
