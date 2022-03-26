from rest_framework import serializers
from .models import *


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

    def update(self, validated_data, **kwargs):
        password = validated_data.pop('password', None)
        instance = self.Meta.model.get(id=validated_data['id'])
        if password is not None:
            instance.set_password(password)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class ClubSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    class Meta:
        model = Club
        fields = '__all__'


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class SimpleMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class ChatSerializer(serializers.ModelSerializer):
    participants = SimpleUserSerializer(many=True, required=False)

    class Meta:
        model = Chat
        fields = '__all__'


class BookRecommendationSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = BookRecommendation
        fields = '__all__'


class BookRecommendationForClubSerializer(serializers.ModelSerializer):
    book = BookSerializer()

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
    recommended_user = SimpleUserSerializer()

    class Meta:
        model = UserRecommendation
        fields = '__all__'


class ClubRecommendationSerializer(serializers.ModelSerializer):
    club = ClubSerializer()

    class Meta:
        model = ClubRecommendation
        fields = '__all__'


class GlobalBookRecommendationSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    class Meta:
        model = GlobalBookRecommendation
        fields = '__all__'


class BookRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRating
        fields = '__all__'


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'
