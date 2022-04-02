# from time import sleep
# from django.test import LiveServerTestCase, TestCase
# from django.contrib.staticfiles.testing import StaticLiveServerTestCase
# from django.conf import settings
# from django.test import override_settings
# from pytest import fixture
# from app.models import User, Club, Chat, Book, Post, BookRating, Comment, Reply
# from django.core.management import call_command
# from django.core import mail

# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.by import By

# from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
#     get_trainset_from_dataset, generate_pred_set, train_model, test_model, dump_trained_model, load_trained_model
# from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users, seed_default_objects, \
#     seed_friends, seed_friend_requests, seed_meetings, seed_feed, seed_messages, print_info
# from surprise import SVD

# from django.db import connections
# from django.db import close_old_connections
# from django import db

# from selenium.webdriver.common.action_chains import ActionChains

# # from testdata import wrap_testdata

# class RealTransactionalLiveServerTestCase(LiveServerTestCase, TestCase): pass

# class FFrontendFunctionalityTest(LiveServerTestCase):
#     serialized_rollback = True

#     port = 8000

#     ai_model_trained = False

#     fixtures = ['db.json']

#     @classmethod
#     def setUpClass(cls):
        
#         call_command('collectstatic', verbosity=0, interactive=False)
#         chrome_options = Options()
#         cls.browser = webdriver.Chrome(chrome_options=chrome_options)
#         cls.browser.set_page_load_timeout(120)
#         cls.actions = ActionChains(cls.browser)
#         cls.browser.delete_all_cookies()
#         cls.setUpTestData()

#         # seed_books()
#         # seed_default_objects()

#         super(FFrontendFunctionalityTest, cls).setUpClass()
        
#         # LiveServerTestCase.setUpClass()




#     @classmethod
#     def tearDownClass(cls):
#         cls.browser.quit()
#         super(FFrontendFunctionalityTest, cls).tearDownClass()

#     # def _fixture_setup(self):
#     #     print(User.objects.count())
#     #     User.objects.create_superuser('Testuser','test@user.com','1234')
#     #     # pass



#     @classmethod
#     def setUpTestData(cls):
#         print("setUpTestData")
#         call_command('loaddata', 'db.json')
#         print(User.objects.count())
#         print("Training model...")
#         cls.csv_file_path = 'app/files/BX-Book-Ratings-filtered.csv'
#         cls.dump_file_path = 'app/files/dump_file'
#         cls.dataframe = get_combined_data(cls.csv_file_path)
#         cls.data = get_dataset_from_dataframe(cls.dataframe)
#         cls.trainset = get_trainset_from_dataset(cls.data)
#         cls.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
#         train_model(cls.algo, cls.trainset)
#         cls.pred = test_model(cls.algo, cls.trainset)
#         dump_trained_model(cls.dump_file_path, cls.algo, cls.pred)

        


#     # #     User.objects.create_superuser('Testuser','test@user.com','1234')
#     # #     seed_books()
#     # #     seed_default_objects()
#     # #     seed_users(50)
#     # #     seed_ratings()
#     # #     seed_clubs(10)
#     # #     seed_friends()
#     # #     seed_friend_requests()
#     # #     seed_friend_requests()
#     # #     seed_meetings()
#     # #     seed_feed()
#     # #     seed_messages()
#     # #     print_info()

#         # Train the recommender system model
        

#     #     cls.user = User.objects.get(username='Jeb')
#     #     cls.login_data = {
#     #         "username": cls.user.username,
#     #         "password": "Password123",
#     #     }
#     #     cls.club = Club.objects.get(name="Kerbal book club")

#     #     cls.book = Book.objects.all()[0]

#     #     cls.new_user_data = {
#     #         "first_name": "firstName",
#     #         "last_name": "lastName",
#     #         "username": "newUsername",
#     #         "email": "newemail@example.com",
#     #         "password": "Password123",
#     #         "bio": "New bio",
#     #         "location": "London, UK",
#     #         "birthday": "10102000"
#     #     }

#     #     cls.new_club_data = {
#     #         "name": "New Club Name",
#     #         "description": "New description"
#     #     }

#     def setUp(self):
#         # if(not self.ai_model_trained):
#         #     
        

#         self.user = User.objects.get(username='Jeb')
#         self.login_data = {
#             "username": self.user.username,
#             "password": "Password123",
#         }

#         self.club = Club.objects.get(name="Kerbal book club")

#         self.book = Book.objects.all()[0]

#         self.new_user_data = {
#             "first_name": "firstName",
#             "last_name": "lastName",
#             "username": "newUsername",
#             "email": "newemail@example.com",
#             "password": "Password123",
#             "bio": "New bio",
#             "location": "London, UK",
#             "birthday": "10102000"
#         }

#         self.new_club_data = {
#             "name": "New Club Name",
#             "description": "New description"
#         }
        

#     def test_test(self):
#         print(User.objects.count())
#         self.browser.get(f"{self.live_server_url}/")
#         sleep(1)
    
#     def test_test_test(self):
#         print(User.objects.count())
#         self.browser.get(f"{self.live_server_url}/log_in/")
#         sleep(1)

#     def test_test_test_test(self):
#         print(User.objects.count())
#         self.browser.get(f"{self.live_server_url}/sign_up/")
#         sleep(1)

#     # def test_log_in(self):
#     #     print(User.objects.count())
#     #     self.browser.get(f"{self.live_server_url}/")
#     #     self.browser.implicitly_wait(10)
#     #     self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
#     #     self.browser.implicitly_wait(10)
#     #     self.wait_until_element_found("//button[.='Log In']")
#     #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
#     #     self.browser.find_element_by_name("username").send_keys(self.login_data['username'])
#     #     self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
#     #     self.browser.find_element_by_xpath("//button[.='Log In']").click()
#     #     self.browser.implicitly_wait(10)
#     #     sleep(10)
#     #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
#     #     self.browser.get(f"{self.live_server_url}/log_out")

#     # def test_wait(self):
#     #     print(User.objects.count())
#     #     self.browser.get(f"{self.live_server_url}/")
#     #     self.browser.implicitly_wait(10)
#     #     self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
#     #     self.browser.implicitly_wait(10)
#     #     self.wait_until_element_found("//button[.='Log In']")
#     #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
#     #     self.browser.find_element_by_name("username").send_keys("Val")
#     #     self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
#     #     self.browser.find_element_by_xpath("//button[.='Log In']").click()
#     #     self.browser.implicitly_wait(10)
#     #     sleep(10)
#     #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
#     #     # sleep(1000)
#     #     self.browser.get(f"{self.live_server_url}/log_out")

#     # def test_waittt(self):
#     #     print(User.objects.count())
#     #     self.browser.get(f"{self.live_server_url}/")
#     #     self.browser.implicitly_wait(10)
#     #     self.browser.find_element_by_xpath("//a[@href='/log_in/']").click()
#     #     self.browser.implicitly_wait(10)
#     #     self.wait_until_element_found("//button[.='Log In']")
#     #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/log_in/")
#     #     self.browser.find_element_by_name("username").send_keys("Bob")
#     #     self.browser.find_element_by_name("password").send_keys(self.login_data['password'])
#     #     self.browser.find_element_by_xpath("//button[.='Log In']").click()
#     #     self.browser.implicitly_wait(10)
#     #     sleep(10)
#     #     self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
#     #     # sleep(1000)
#     #     self.browser.get(f"{self.live_server_url}/log_out")

#     def test_sign_up_and_book_rating(self):
#         number_of_users_before = User.objects.count()
#         self.browser.get(f"{self.live_server_url}/")
#         self.browser.implicitly_wait(10)
#         self.wait_until_element_found("//a[@href='/sign_up/']")
#         self.browser.find_element_by_xpath("//a[@href='/sign_up/']").click()
#         self.browser.implicitly_wait(10)
#         self.wait_until_element_found("//button[.='Sign Up']")
#         self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/")
#         self.browser.find_element_by_name("first_name").send_keys(self.new_user_data['first_name'])
#         self.browser.find_element_by_name("last_name").send_keys(self.new_user_data['last_name'])
#         self.browser.find_element_by_name("username").send_keys(self.new_user_data['username'])
#         self.browser.find_element_by_name("email").send_keys(self.new_user_data['email'])
#         self.browser.find_element_by_name("password").send_keys(self.new_user_data['password'])
#         self.browser.find_element_by_name("bio").send_keys(self.new_user_data['bio'])
#         self.browser.find_element_by_name("location").send_keys(self.new_user_data['location'])
#         self.browser.find_element_by_name("birthday").send_keys(self.new_user_data['birthday'])
#         self.browser.find_element_by_xpath('//button[.="Sign Up"]').click()
#         self.browser.implicitly_wait(10)
#         sleep(1)
#         number_of_users_after = User.objects.count()
#         self.assertEqual(number_of_users_after, number_of_users_before+1)
#         self.assertEqual(self.browser.current_url, f"{self.live_server_url}/sign_up/rating")
#         self.wait_until_element_found("//span[@data-index='3']", 20)
#         self.browser.find_element_by_xpath("//span[@data-index='3']").click()
#         self.browser.implicitly_wait(10)
#         sleep(1)
#         self.browser.find_element(by=By.XPATH, value='//button[.="Clear"]').click()
#         self.browser.implicitly_wait(10)
#         sleep(1)
#         self.browser.find_element_by_xpath("//span[@data-index='4']").click()
#         self.browser.implicitly_wait(10)
#         sleep(1)
#         self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#         sleep(2)
#         self.browser.find_element_by_xpath('//button[.="Finish"]').click()
#         self.browser.implicitly_wait(10)
#         self.assertEqual(self.browser.current_url, f"{self.live_server_url}/home")
#         self.browser.get(f"{self.live_server_url}/log_out")

#     def test_wait(self):
#         self.browser.get(f"{self.live_server_url}/")
#         sleep(10000)

#     #from source: --
#     def wait_until_element_found(self, xpath, time=15):
#         WebDriverWait(self.browser, timeout=time).until(
#             lambda x: self.browser.find_element_by_xpath(xpath)
#         )

#     # def setUp(self):
#     #     # Seed the database
#     #     seed_books()
#     #     seed_default_objects()
#     #     seed_users(50)
#     #     seed_ratings()
#     #     seed_clubs(10)
#     #     seed_friends()
#     #     seed_friend_requests()
#     #     seed_friend_requests()
#     #     seed_meetings()
#     #     seed_feed()
#     #     seed_messages()
#     #     print_info()

#     #     # Train the recommender system model
#     #     self.csv_file_path = 'app/files/BX-Book-Ratings-filtered.csv'
#     #     self.dump_file_path = 'app/files/dump_file'
#     #     self.dataframe = get_combined_data(self.csv_file_path)
#     #     self.data = get_dataset_from_dataframe(self.dataframe)
#     #     self.trainset = get_trainset_from_dataset(self.data)
#     #     self.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
#     #     train_model(self.algo, self.trainset)
#     #     self.pred = test_model(self.algo, self.trainset)
#     #     dump_trained_model(self.dump_file_path, self.algo, self.pred)

#     #     # # The user used for testing
#     #     self.user = User.objects.get(username='Jeb')
#     #     self.login_data = {
#     #         "username": self.user.username,
#     #         "password": "Password123",
#     #     }
#     #     self.club = Club.objects.get(name="Kerbal book club")

#     #     self.book = Book.objects.all()[0]

#     #     self.new_user_data = {
#     #         "first_name": "firstName",
#     #         "last_name": "lastName",
#     #         "username": "newUsername",
#     #         "email": "newemail@example.com",
#     #         "password": "Password123",
#     #         "bio": "New bio",
#     #         "location": "London, UK",
#     #         "birthday": "10102000"
#     #     }

#     #     self.new_club_data = {
#     #         "name": "New Club Name",
#     #         "description": "New description"
#     #     }


