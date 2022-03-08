from rest_framework import serializers
from .models import User, Chat, BookRecommendation, UserRecommendation, ClubRecommendation, GlobalBookRecommendation, \
    BookRecommendationForClub, Club


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
        model = Club
        fields = '__all__'


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class ChatSerializer(serializers.ModelSerializer):
    participants = SimpleUserSerializer(many=True, required=False)

    class Meta:
        model = Chat
        fields = ('__all__')
    

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
