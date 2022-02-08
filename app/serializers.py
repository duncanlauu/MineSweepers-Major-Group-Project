from rest_framework import serializers
from .models import User

class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'bio', 'location', 'birthday', 'created_at', 'liked_books', 'read_books')
