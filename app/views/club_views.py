from django.conf import settings
from django.views.generic.edit import FormView
from django.contrib.auth import login
from .mixins import LoginProhibitedMixin
from app.forms import CreateClubForm
from app.models import Club, User
from django.urls import reverse
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

@login_required
def create_club(request):
    current_user = request.user
    if request.method == 'POST':
        form = CreateClubForm(request.POST)
        if form.is_valid():
            club = form.save(current_user)
            return redirect('home')
    else:
        form = CreateClubForm()
    return render(request, 'create_club.html', {'form': form})

@login_required
def club_list(request):
    clubs = Club.objects.filter(visibility=True)
    return render(request, 'club_list.html', {'clubs': clubs})

@login_required
def user_club_list(request):
    current_user = request.user.id
    clubs = Club.objects.filter(Q(owner=current_user) | Q(admins=current_user) | Q(members=current_user))
    return render(request, 'club_list.html', {'clubs': clubs})

# TODO: refactor with sessions for club_id
@login_required
def accept_applicant(request, club_id, applicant_id):
    current_user = request.user
    club = Club.objects.get(club_id=club_id)
    if club.owner == current_user:
        applicant = User.objects.get(pk=applicant_id)
        club.remove_applicant(applicant)
        club.add_member(applicant)
    return render(request, "dummy.html")

@login_required
def reject_applicant(request, club_id, applicant_id):
    current_user = request.user
    club = Club.objects.get(club_id=club_id)
    if club.owner == current_user:
        applicant = User.objects.get(pk=applicant_id)
        club.remove_applicant(applicant)
    return render(request, "dummy.html")

@login_required
def ban_members(request, club_id, member_id):
    current_user = request.user
    club = Club.objects.get(club_id=club_id)
    if club.owner == current_user:
        member = User.objects.get(pk=member_id)
        club.remove_member(member)
        club.add_banned_user(member)
    return render(request, "dummy.html")