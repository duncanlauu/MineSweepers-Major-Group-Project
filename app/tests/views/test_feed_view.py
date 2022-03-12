from django.test import TestCase



class FeedAPIViewTestCase(TestCase):
    """Tests of the Feed related API views."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/default_book.json']

    def setUp(self):
        self.club = Club.objects.get(name="Joe's Club")
        self.applicant = User.objects.get(username='jamesdoe')
        self.url = reverse('reject_applicant', kwargs={'club_id': self.club.id, 'applicant_id': self.applicant.id})

    def test_reject_applicant_url(self):
        self.assertEqual(self.url, f'/reject_applicant/{self.club.id}/{self.applicant.id}')
