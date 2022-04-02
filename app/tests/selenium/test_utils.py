# #https://stackoverflow.com/questions/14984683/django-liveservertestcase-user-created-in-in-setupclass-method-not-available-in
# # from selenium.webdriver.firefox.webdriver import WebDriver
# from django.test import LiveServerTestCase, TestCase

# from selenium import webdriver

# class CustomLiveTestCase(LiveServerTestCase, TestCase):

#     port = 8000

#     @classmethod
#     def setUpClass(cls):
#         cls.browser =  webdriver.Chrome(executable_path="app/tests/selenium/chromedriver")
#         super(CustomLiveTestCase, cls).setUpClass()

#     @classmethod
#     def tearDownClass(cls):
#         cls.browser.quit()
#         super(CustomLiveTestCase, cls).tearDownClass()