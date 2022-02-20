from unittest import mock
from rest_framework import serializers
from .models import User, Club


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class ClubSerializer(serializers.ModelSerializer):

    class Meta:
        model: Club
        fields: '__all__'

    def create(self, validated_data):
        owner = self.context['request'].user
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.members = validated_data.get('members', instance.members)
        instance.admins = validated_data.get('admins', instance.admins)
        instance.applicants = validated_data.get('applicants', instance.applicants)
        instance.banned_users = validated_data.get('banned_users', instance.banned_users)
        instance.books = validated_data.get('books', instance.books)
        instance.visibility = validated_data.get('visibility', instance.visibility)
        instance.public = validated_data.get('public', instance.public)
        instance.save()
        return instance

