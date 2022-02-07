from django.contrib import admin

from .models import  User, Club , Book

# Register your models here.
admin.site.register(User)
admin.site.register(Club)
admin.site.register(Book)