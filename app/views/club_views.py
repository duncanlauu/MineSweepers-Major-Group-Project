from app.forms import CreateClubForm
from app.models import Club, User
from app.helpers import remove_user_from_club, user_in_club, user_is_banned
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
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

# TODO: requirements for banned users not specified
@login_required
def apply_club(request, club_id):
    try:
        current_user = request.user
        club = Club.objects.get(pk=club_id)
        is_banned = user_is_banned(club_id, current_user.id)
        if not user_in_club(club_id, current_user.id) and not is_banned:
            club.add_applicant(current_user)
        return render(request, "dummy.html")
    except ObjectDoesNotExist:
        return render(request, "dummy.html")

@login_required
def accept_applicant(request, club_id, applicant_id):
    try:
        current_user = request.user
        club = Club.objects.get(pk=club_id)
        if club.owner == current_user:
            applicant = User.objects.get(pk=applicant_id)
            club.remove_applicant(applicant)
            club.add_member(applicant)
        return render(request, "dummy.html")
    except ObjectDoesNotExist:
        return render(request, "dummy.html")


@login_required
def reject_applicant(request, club_id, applicant_id):
    try:
        current_user = request.user
        club = Club.objects.get(pk=club_id)
        applicant = User.objects.get(pk=applicant_id)
        if club.owner == current_user:
            club.remove_applicant(applicant)
        return render(request, "dummy.html")
    except ObjectDoesNotExist:
        return render(request, "dummy.html")


@login_required
def ban_member(request, club_id, member_id):
    try:
        current_user = request.user
        club = Club.objects.get(pk=club_id)
        member = User.objects.get(pk=member_id)
        if club.owner == current_user:
            club.remove_member(member)
            club.add_banned_user(member)
        return render(request, "dummy.html")
    except ObjectDoesNotExist:
        return render(request, "dummy.html")


@login_required
def transfer_ownership(request, club_id, new_owner_id):
    try:
        current_user = request.user
        club = Club.objects.get(pk=club_id)
        new_owner = User.objects.get(pk=new_owner_id)
        if club.owner == current_user and current_user.id != new_owner_id:
            remove_user_from_club(club_id, new_owner_id)
            Club.objects.filter(pk=club_id).update(owner=new_owner)
            club.add_admin(current_user)
        return render(request, "dummy.html")
    except ObjectDoesNotExist:
        return render(request, "dummy.html")
