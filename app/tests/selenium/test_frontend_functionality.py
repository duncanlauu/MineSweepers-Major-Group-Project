from time import sleep
from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.conf import settings
from django.test import override_settings
from app.models import User, Club, Chat
from django.core.management import call_command
from django.core import mail

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys

from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, generate_pred_set, train_model, test_model, dump_trained_model, load_trained_model
from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users
from surprise import SVD

class FrontendFunctionalityTest(LiveServerTestCase):

    port = 8000

    # fixtures = [
    #     'app/tests/fixtures/default_user.json',
    #     'app/tests/fixtures/default_chat.json',
    #     'app/tests/fixtures/default_message.json',
    #     'app/tests/fixtures/other_users.json',
    #     'app/tests/fixtures/other_chats.json',
    #     'app/tests/fixtures/other_messages.json',
        
    # ]

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_message.json',
                'app/tests/fixtures/other_messages.json',
                'app/tests/fixtures/default_chat.json',
                'app/tests/fixtures/other_chats.json',
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

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Call collectstatic before running live server
        call_command('collectstatic', verbosity=0, interactive=False)
        chrome_options = Options()

        #for headless testing
        # if not cls.SHOW_BROWSER:
        #     chrome_options.add_argument("--headless")
        #     chrome_options.add_argument("--window-size=1200,800")

        cls.browser = webdriver.Chrome(
            executable_path="app/tests/selenium/chromedriver", options=chrome_options
        )
        cls.browser.delete_all_cookies()

        seed_books()
        seed_users()
        seed_ratings()
        seed_clubs()
        cls.csv_file_path = 'app/files/BX-Book-Ratings-filtered.csv'
        cls.dump_file_path = 'app/files/dump_file'
        cls.dataframe = get_combined_data(cls.csv_file_path)
        cls.data = get_dataset_from_dataframe(cls.dataframe)
        cls.trainset = get_trainset_from_dataset(cls.data)
        cls.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
        train_model(cls.algo, cls.trainset)
        cls.pred = test_model(cls.algo, cls.trainset)
        dump_trained_model(cls.dump_file_path, cls.algo, cls.pred)

        

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.browser.quit()

    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.login_data = {
            "username": self.user.username,
            "password": "Password123",
        }

    # @override_settings(DEBUG=True)  
    def test_landing_page_contains_log_in_and_sing_up_buttons(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.browser.find_element_by_xpath("//a[@href='/log_in']")
        self.browser.find_element_by_xpath("//a[@href='/sign_up']")

    # @override_settings(DEBUG=True) 
    def test_log_in(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")

    # add test for failed log in and test for error messages

    def test_sign_up_and_log_in_new_user(self):
        number_of_users_before = User.objects.count()
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/sign_up']").click()
        self.wait_until_element_found("//button[.='Sign Up']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up")
        # Sign up
        new_user_data = {
            "first_name": "firstName",
            "last_name": "lastName",
            "username": "newUsername",
            "email": "newemail@example.com",
            "password": "Password123",
            "bio": "New bio",
            "location": "London, UK",
            "birthday": "10102000"
        }
        self.browser.find_element_by_name("first_name").send_keys(new_user_data['first_name'])
        self.browser.find_element_by_name("last_name").send_keys(new_user_data['last_name'])
        self.browser.find_element_by_name("username").send_keys(new_user_data['username'])
        self.browser.find_element_by_name("email").send_keys(new_user_data['email'])
        self.browser.find_element_by_name("password").send_keys(new_user_data['password'])
        self.browser.find_element_by_name("bio").send_keys(new_user_data['bio'])
        self.browser.find_element_by_name("location").send_keys(new_user_data['location'])
        self.browser.find_element_by_name("birthday").send_keys(new_user_data['birthday'])
        self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
        self.wait_until_element_found("//button[.='Log In']")
        number_of_users_after = User.objects.count()
        self.assertEqual(number_of_users_after, number_of_users_before+1)
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
        # Log in
        self.browser.find_element_by_name("username").send_keys(new_user_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
    
    # add test for failed sign up and check for error messages

    def test_create_new_club(self):#broken
        number_of_clubs_before = Club.objects.count()
        number_of_chats_before = Chat.objects.count()
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
        # Create New Club
        new_club_data = {
            "name": "New Club Name",
            "description": "New description"
        }
        self.browser.find_element_by_xpath("//button[.='New Club']").click()
        self.browser.find_element_by_name("name").send_keys(new_club_data['name'])
        self.browser.find_element_by_id("description").send_keys(new_club_data['description']) #ID / NAME inconsistent
        self.browser.find_element_by_xpath("//button[.='Create']").click()
        self.wait_until_element_found("//button[.='New Club']")
        number_of_clubs_after = Club.objects.count()
        number_of_chats_after = Chat.objects.count()
        self.assertEqual(number_of_clubs_after, number_of_clubs_before+1)
        self.assertEqual(number_of_chats_after, number_of_chats_before+1)

    def test_log_out(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
        # Navigate to LOG OUT with buttons (NOT Implemented in frontend yet?)
        self.browser.get(f"{self.live_server_url}/log_out")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/")
        # Check that logged out??

    def test_notifications_page(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # Navigate to Notifications page
        self.wait_until_element_found("//a[@href='/notifications/']")
        self.browser.find_element_by_xpath("//a[@href='/notifications/']").click()
        self.wait_until_element_found("//text[.='Your Activity']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/notifications/")
        # Add more test if functionality exists?

    def test_recommendations_page(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # Navigate to Recommendations page
        self.wait_until_element_found("//a[@href='/recommendations/']")
        self.browser.find_element_by_xpath("//a[@href='/recommendations/']").click()
        self.wait_until_element_found("//text[.='Books For You']") 
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/recommendations/")
        # Needs to be seeded for this to work but test for recommendations ?
        # Maybe test for response time also?

    def test_logo_navigates_to_home(self):
        pass

    def test_logo_in_log_in_navigates_to_log_in(self):
        pass

    def test_log_in_has_link_to_sign_up(self):
        pass

    def test_sign_up_has_link_to_log_in(self):
        pass

    def test_club_list(self):
        pass

    def test_friends_page(self):
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # Navigate to Friends Page with buttons (NOT Implemented in frontend yet?)
        self.browser.get(f"{self.live_server_url}/friends_page")

    def test_page_redicrects_to_log_in_when_not_logged_in(self):
        pass

    def test_scheduling_page(self):
        pass

    def test_chat_page(self):
        '''
        Unable to test chat frontend functionality (Connecting to websocket) with selenium
        due to a python multihtreading error when running ChannelsLiveServerTestCase.
        https://github.com/django/channels/issues/1485 
        '''
        # Test navigation to page, selecting chats
        pass

    def test_hello(self):
        #???
        pass

    def test_meetings_page(self):
        pass

    def test_recommend_clubs_page(self):
        # ???
        pass

    def test_club_profile_page(self):
        self.browser.get(f"{self.live_server_url}/")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # Log in
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
        # Navigate to club 1 page with buttons (To be implemented?)
        # Or use the search bar to find it ?
        self.browser.get(f"{self.live_server_url}/club_profile/1") #My club (Owner)
        self.browser.find_element_by_xpath('//button[.="Meetings"]').click()
        self.browser.find_element_by_xpath('//button[.="Schedule a Meeting"]').click()

        
        # self.browser.find_element_by_xpath('//button[.="Members"]').click()
        # sleep(1)
        # # Remove member
        # # Ban member
        # # Approve Applicant
        # # Decline Applicant
        # # Make Owner ?
        # self.browser.find_element_by_xpath('//button[.="Feed"]').click()
        # #??
        # sleep(1)
        
        # Create Meeting 
        sleep(1)


    def test_search_bar(self):
        pass

    def test_404(self):
        # go to non_existent_url
        self.browser.get(f"{self.live_server_url}/non_existent_url")
        # find a link to homepage ? or home?
        pass

    def test_password_reset(self):
        new_password = "NewPassword123"
        self.browser.get(f"{self.live_server_url}/")
        self.assertEquals(self.browser.title, "Bookgle")
        self.wait_until_element_found("//a[@href='/log_in']")
        self.wait_until_element_found("//a[@href='/sign_up']")
        self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        self.wait_until_element_found("//button[.='Log In']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
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
        self.browser.find_element_by_xpath('//button[.="Send Reset Email"]').click() # Needs to be renamed!
        
        # Redirects to login?
        sleep(1)

        # Log in with new password
        self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        self.browser.find_element_by_name("password").send_keys(new_password)
        self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        self.wait_until_element_found("//button[.='New Club']")
        self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")


    # def test_chat_messaging(self): needs separate test case file
    #     # number_of_clubs_before = Club.objects.count()
    #     # number_of_chats_before = Chat.objects.count()
    #     self.browser.get(f"{self.live_server_url}/")
    #     self.assertEquals(self.browser.title, "Bookgle")
    #     self.wait_until_element_found("//a[@href='/log_in']")
    #     self.wait_until_element_found("//a[@href='/sign_up']")
    #     self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
    #     self.wait_until_element_found("//button[.='Log In']")
    #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
    #     # Log in
    #     self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
    #     self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
    #     self.browser.find_element_by_xpath('//button[.="Log In"]').click()
    #     self.wait_until_element_found("//button[.='New Club']")
    #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
    #     # Navigate to chat with buttons (NOT Implemented in frontend yet)
    #     self.browser.get(f"{self.live_server_url}/chat")
    #     self.wait_until_element_found("//button[.='Newww Club']")

        # self.browser.find_element_by_id("chat-message-input").send_keys("New Message Content")
    


# XPath is a very flexible and powerful tool. For example, you can:
# Select elements by ID: "//input[@id='id_title']"
# Select elements by any other attribute: "//div[@aria-label='Blank']"
# Select elements by innerText: "//button[.='Save']"
# Select elements by CSS class and innerText: "//button[contains(@class,'btn-primary')][.='Save']"
# Select the first element by innerText: "(//button[.='yes'])[1]"

    #from source: --
    def wait_until_element_found(self, xpath):
        WebDriverWait(self.browser, timeout=10).until(
            lambda x: self.browser.find_element_by_xpath(xpath)
        )