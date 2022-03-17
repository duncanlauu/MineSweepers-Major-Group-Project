from django.db.models import Q
from app.models import Club, User


def remove_user_from_club(club_id, user_id):
    club = Club.objects.get(pk=club_id)
    user = User.objects.get(pk=user_id)
    if club.admins.filter(id=user_id).exists():
        club.remove_admin(user)
    elif club.members.filter(id=user_id).exists():
        club.remove_member(user)


def user_in_club(club_id, user_id):
    user = User.objects.get(id=user_id)
    return Club.objects.filter(Q(id=club_id) & Q(owner=user) | Q(admins=user) | Q(members=user)).exists()


def user_is_banned(club_id, user_id):
    user = User.objects.get(id=user_id)
    return Club.objects.filter(Q(id=club_id) & Q(banned_users=user)).exists()
