from rest_framework import serializers
from .models import User, BookRecommendation, UserRecommendation, ClubRecommendation, GlobalBookRecommendation, \
    BookRecommendationForClub


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


class BookRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRecommendation
        fields = '__all__'


class BookRecommendationForClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRecommendationForClub
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
