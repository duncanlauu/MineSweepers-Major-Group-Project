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

