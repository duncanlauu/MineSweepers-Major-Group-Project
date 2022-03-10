
from itertools import chain
from django.views.generic import ListView
from app.models import Club, User, Book
from rest_framework.views import APIView



# source : https://www.codingforentrepreneurs.com/blog/a-multiple-model-django-search-engine

class SearchView(ListView, APIView):
    paginate_by = 10
    count = 0

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["count"] = self.count or 0
        context['query'] = self.request.GET.get('q')
        return context
    
    def get_queryset(self):
        request = self.request
        query = request.GET.get('q', None)
        
        if query is not None:
            book_results = Book.objects.search(query)
            club_results = Club.objects.search(query)
            user_results    = User.objects.search(query)
            
            # combine querysets 
            queryset_chain = chain(
                    book_results,
                    club_results,
                    user_results
            )        
            qs = sorted(queryset_chain, 
                        key=lambda instance: instance.pk, 
                        reverse=True)
            self.count = len(qs) # since qs is actually a list
            return qs
        return Book.objects.none() # just an empty queryset


    def get(self):
        pass
