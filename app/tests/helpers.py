# Helpets modified from Clucker
from django.urls import reverse
# from with_asserts.mixin import AssertHTMLMixin

def reverse_with_next(url_name, next_url):
    url = reverse(url_name)
    url += f"?next={next_url}"
    return url

class LogInTester:
    def _is_logged_in(self):
        return '_auth_user_id' in self.client.session.keys()

# class MenuTesterMixin(AssertHTMLMixin):
#     menu_urls = [
#         reverse('user_list'), reverse('feed'), reverse('password'),
#         reverse('profile'), reverse('log_out')
#     ]
#
#     def assert_menu(self, response):
#         for url in self.menu_urls:
#             with self.assertHTML(response, f'a[href="{url}"]'):
#                 pass
#
#     def assert_no_menu(self, response):
#         for url in self.menu_urls:
#             self.assertNotHTML(response, f'a[href="{url}"]')
