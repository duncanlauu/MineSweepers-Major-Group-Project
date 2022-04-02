# #https://stackoverflow.com/questions/14984683/django-liveservertestcase-user-created-in-in-setupclass-method-not-available-in
# from selenium.webdriver.firefox.webdriver import WebDriver
# from django.test import LiveServerTestCase, TestCase

# class CustomLiveTestCase(LiveServerTestCase, TestCase):

#     @classmethod
#     def setUpClass(cls):
#         cls.wd = WebDriver()
#         super(CustomLiveTestCase, cls).setUpClass()

#     @classmethod
#     def tearDownClass(cls):
#         cls.wd.quit()
#         super(CustomLiveTestCase, cls).tearDownClass()