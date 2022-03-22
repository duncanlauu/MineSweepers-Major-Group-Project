from django.test import LiveServerTestCase
from selenium import webdriver

class ExampleTestCase(LiveServerTestCase):
    
    def test(self):
        driver = webdriver.Chrome("app/tests/selenium/chromedriver")

        driver.get('http://127.0.0.1:8000/')
        assert "Bookgle" in driver.title