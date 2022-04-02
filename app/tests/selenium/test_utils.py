# #https://stackoverflow.com/questions/14984683/django-liveservertestcase-user-created-in-in-setupclass-method-not-available-in
# # from selenium.webdriver.firefox.webdriver import WebDriver
# from django.test import LiveServerTestCase, TestCase
# from django.core.management import call_command
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.action_chains import ActionChains

# from selenium import webdriver

# class CustomLiveTestCase(LiveServerTestCase, TestCase):

#     @classmethod
#     def setUpClass(cls):
#         super(CustomLiveTestCase, cls).setUpClass()
#         call_command('collectstatic', verbosity=0, interactive=False)
#         chrome_options = Options()
#         cls.browser =  webdriver.Chrome()
#         cls.browser = webdriver.Chrome(chrome_options=chrome_options)
#         cls.browser.set_page_load_timeout(120)
#         cls.actions = ActionChains(cls.browser)
#         cls.browser.delete_all_cookies()
        

#     @classmethod
#     def tearDownClass(cls):
#         super(CustomLiveTestCase, cls).tearDownClass()
#         cls.browser.quit()
        