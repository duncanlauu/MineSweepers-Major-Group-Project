from django.test import LiveServerTestCase
from django.conf import settings
from django.test import override_settings
from app.models import User, Club, Chat

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

class LandingPageTestCase(LiveServerTestCase):

    port = 8000

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_chat.json',
        'app/tests/fixtures/default_message.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/other_chats.json',
        'app/tests/fixtures/other_messages.json',
    ]

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # cls.user1 = User.objects.create_user(
        #     cls.USER1_USERNAME, cls.USER1_EMAIL, cls.USER1_PASSWORD
        # )

        chrome_options = Options()

        #for headless testing
        # if not cls.SHOW_BROWSER:
        #     chrome_options.add_argument("--headless")
        #     chrome_options.add_argument("--window-size=1200,800")

        cls.browser = webdriver.Chrome(
            executable_path="app/tests/selenium/chromedriver", options=chrome_options
        )
        cls.browser.delete_all_cookies()

        

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.browser.quit()
        # … delete subscription for the user …
        # cls.user1.delete()

    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        # cls.default_chat = Chat.objects.get(pk=1)
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

    def test_create_new_club(self):
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



    # def test_friends_page(self):
    #     self.browser.get(f"{self.live_server_url}/friends_page")
    #     self.assertEquals(self.browser.title, "Bookgle")
    #     self.wait_until_element_found("//a[@href='/log_in']")
        # self.wait_until_element_found("//a[@href='/sign_up']")
        # self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
        # self.wait_until_element_found("//button[.='Log In']")
        # self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
        # # Log in
        # self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
        # self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
        # self.browser.find_element_by_xpath('//button[.="Log In"]').click()
        # self.wait_until_element_found("//button[.='New Club']")
        # self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")

    # @override_settings(DEBUG=True) 
    # def test_log_in_with_wrong_password(self):
    #     self.browser.get(f"{self.live_server_url}/")
    #     self.assertEquals(self.browser.title, "Bookgle")
    #     self.wait_until_element_found("//a[@href='/log_in']")
    #     self.wait_until_element_found("//a[@href='/sign_up']")
    #     self.browser.find_element_by_xpath("//a[@href='/log_in']").click()
    #     self.wait_until_element_found("//button[.='Log In']")
    #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in")
    #     # Log in
    #     self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
    #     self.browser.find_element_by_name("password").send_keys("WrongPassword")
    #     self.browser.find_element_by_xpath('//button[.="Log In"]').click()
    #     self.wait_until_element_found("//button[.='Log inn']")
    #     # self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")

    #     # Update from develop for error messages and test for them


        

#     XPath is a very flexible and powerful tool. For example, you can:

# Select elements by ID: "//input[@id='id_title']"
# Select elements by any other attribute: "//div[@aria-label='Blank']"
# Select elements by innerText: "//button[.='Save']"
# Select elements by CSS class and innerText: "//button[contains(@class,'btn-primary')][.='Save']"
# Select the first element by innerText: "(//button[.='yes'])[1]"


    # @classmethod
    # def setUpClass(self):
    #     super().setUpClass()
    #     self.driver = webdriver.Chrome("app/tests/selenium/chromedriver")
    #     self.driver.implicitly_wait(10)
    #     # cls.selenium = webdriver.Chrome("app/tests/selenium/chromedriver")
    #     # cls.selenium.implicitly_wait(10)

    # @classmethod
    # def tearDownClass(self):
    #     self.driver.quit()
    #     super().tearDownClass()

    # def test_title(self):
    #     # self.selenium.get('%s%s' % (self.live_server_url, '/'))
    #     self.driver.get('%s%s' % (self.live_server_url, '/'))
    #     self.assertEquals(self.driver.title, "Bookgle")

    # def test_log_in_button(self):
    #     self.selenium.get('%s%s' % (self.live_server_url, '/'))
    #     self.selenium.
        # username_input = self.selenium.find_element_by_name("log_in")

    # def test_sign_in_button(self):
    #     self.selenium.get('%s%s' % (self.live_server_url, '/'))
    #     self.assertEquals(self.selenium.title, "Bookgle")

    # def test_title(self):
    #     driver = 
        
    #     driver.get(self.live_server_url)
    #     # driver.get('http://127.0.0.1:8000/')
    #     assert "Bookgle" in driver.title

    #from source: --
    def wait_until_element_found(self, xpath):
        WebDriverWait(self.browser, timeout=10).until(
            lambda x: self.browser.find_element_by_xpath(xpath)
        )

    def wait_a_little(self, seconds=2):
        if SHOW_BROWSER:
            sleep(seconds)