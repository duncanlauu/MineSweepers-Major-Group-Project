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

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.location = validated_data.get('location', instance.location)
        instance.birthday = validated_data.get('birthday', instance.birthday)
        instance.liked_books.set(validated_data.get('liked_books', instance.liked_books.all()))
        instance.read_books.set(validated_data.get('read_books', instance.read_books.all()))
        instance.clubs.set(validated_data.get('clubs', instance.clubs.all()))
        instance.friends.set(validated_data.get('friends', instance.friends.all()))
        instance.save()
        return instance


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


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
    book = BookSerializer(required=False)

    class Meta:
        model = Meeting
        fields = '__all__'
