from time import sleep
from django.test import LiveServerTestCase
from django.conf import settings
from django.test import override_settings
from app.models import User, Club, Chat

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys

from channels.testing import ChannelsLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.wait import WebDriverWait

# class FrontendFunctionalityTest(ChannelsLiveServerTestCase):
#     serve_static = True  # emulate StaticLiveServerTestCase
'''
Unable to test chat frontend functionality with selenium due to a python 
multihtreading error when running ChannelsLiveServerTestCase.
https://github.com/django/channels/issues/1485 
'''
    