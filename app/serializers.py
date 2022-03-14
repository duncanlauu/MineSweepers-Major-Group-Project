from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
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

    def update(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model.get(id=validated_data['id'])
        if password is not None:
            instance.set_password(password)
        for k, v in validated_data.items():
            setattr(instance, k, v)


class BookRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRecommendation
        fields = '__all__'


class BookRecommendationForClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRecommendationForClub
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'


class UserRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRecommendation
        fields = '__all__'


class ClubRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubRecommendation
        fields = '__all__'


class GlobalBookRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalBookRecommendation
        fields = '__all__'
