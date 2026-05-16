import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


#from .models import User #table el user f el models m4 ha7tago 34an already andy wa7d mn django.contrib.auth.models
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

#tokens imorts
import uuid # this generates random unique codes
from django.core.mail import EmailMessage
from .models import PasswordResetToken,EmailConfirmationToken

from django.contrib.auth import authenticate, login as auth_login

import json
import uuid
from django.contrib.auth.models import User  #el hwa daa el user model el built in bta3 django
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    EmailConfirmationToken,
    Institution,
    InstitutionMember,
)
from functools import wraps
from django.http import JsonResponse


def api_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper


@csrf_exempt

def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        full_name        = data.get("fullName", "").strip()
        email            = data.get("email", "").strip().lower()
        phone            = data.get("phone", "").strip()
        country_code     = data.get("countryCode", "+20").strip()
        user_type        = data.get("userType", "student").strip()
        password         = data.get("password", "")
        confirm_password = data.get("confirmPassword", "")

        # New fields
        is_institutional = bool(data.get("isInstitutional", False))
        institution_user_id = data.get("institutionUserId", "").strip()

        # ─── BASIC VALIDATION ──────────────────────────────────
        if not all([full_name, email, password, confirm_password]):
            return JsonResponse({"error": "All fields are required"}, status=400)

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        if User.objects.filter(username=email).exists():
            return JsonResponse({"error": "Email already registered"}, status=400)

        if user_type not in ("student", "teacher"):
            return JsonResponse({"error": "Invalid user type"}, status=400)

        # ─── BUSINESS RULES ────────────────────────────────────
        # Free users can ONLY be students
        if not is_institutional and user_type == "teacher":
            return JsonResponse(
                {"error": "Teacher accounts require an institution. Please sign up as a Helwan University member."},
                status=400
            )

        # Institutional users must provide their university ID
        if is_institutional and not institution_user_id:
            return JsonResponse(
                {"error": "Institution ID is required for Helwan University members"},
                status=400
            )

        # If institutional, verify the ID isn't already taken
        if is_institutional:
            helwan = Institution.objects.first()
            if not helwan:
                return JsonResponse({"error": "No institution configured"}, status=500)

            if InstitutionMember.objects.filter(
                institution=helwan,
                institution_user_id=institution_user_id
            ).exists():
                return JsonResponse(
                    {"error": "This institution ID is already registered"},
                    status=400
                )

        # ─── CREATE THE USER ───────────────────────────────────
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name,
            is_active=False,  # email confirmation pending
        )

        # Profile
        profile = user.profile
        profile.phone = f"{country_code}{phone}"
        profile.user_type = user_type
        profile.save()

        # Institution membership (if applicable)
        if is_institutional:
            InstitutionMember.objects.create(
                user=user,
                institution=helwan,
                institution_user_id=institution_user_id,
            )

        # ─── SEND CONFIRMATION EMAIL ───────────────────────────
        token = str(uuid.uuid4())
        EmailConfirmationToken.objects.create(user=user, token=token)
        confirm_link = f"http://localhost:3000/confirm-email?token={token}"

        send_mail(
            subject="Confirm Your EduMetric Email",
            message=(
                f"Hello {full_name},\n\n"
                f"Please confirm your email by clicking the link below:\n{confirm_link}\n\n"
                f"This link expires in 24 hours.\n\n"
                f"If you didn't register, ignore this email."
            ),
            from_email="edumetric.plattform2026@gmail.com",
            recipient_list=[email],
        )

        return JsonResponse({
            "message": "Account created! Check your email to confirm your account.",
            "is_institutional": is_institutional,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt

def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        email       = data.get("email", "").strip().lower()
        password    = data.get("password", "")
        remember_me = data.get("remember_me",False)

        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)

        user = authenticate(request, username=email, password=password)
        if user is None:
            return JsonResponse({"error": "Invalid email or password"}, status=400)

        if not user.is_active:
            return JsonResponse({"error": "Please confirm your email before logging in"}, status=400)

        auth_login(request, user)

        request.session.cycle_key() # 34an may7sal4 conflict f el seesions w na b3ml switching f el users

        if remember_me:
            request.session.set_expiry(1209600)  # 2 weeks
        else:
            request.session.set_expiry(0)  # expires on browser close

        # Check if user belongs to an institution
        membership = getattr(user, "institution_membership", None)

        return JsonResponse({
            "message":          "Login successful",
            "full_name":        user.first_name,
            "user_type":        user.profile.user_type,
            "is_institutional": membership is not None,
            "institution":      membership.institution.name if membership else None,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from django.http import JsonResponse


def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    user = request.user
    membership = getattr(user, "institution_membership", None)

    return JsonResponse({
        "id":               user.id,
        "full_name":        user.first_name,
        "email":            user.email,
        "user_type":        user.profile.user_type,
        "is_institutional": membership is not None,
        "institution":      membership.institution.name if membership else None,
        "institution_user_id": membership.institution_user_id if membership else None,
    })


#############################
#reset password view#

# hna el user hy7ott el email bta3o 34an neb3tlo 3lyh message feha link y3ml click 3leha w yro7 ll page gdida 34an y3ml fiha reset ll password bta3o
@csrf_exempt
def forgot_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
        
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)
        
        # check if user exists
        try:
            user = User.objects.get(email=email)
            print(f"✅ User found: {user.email}")
        except User.DoesNotExist:
            print("❌ User not found")  # ← add this
            return JsonResponse({"message": "a reset link has been sent"}) #hna m4 ha2olo en el email dosent exist 34an el hacking
        
        # delete ay token adema abl ma a3ml wa7da gdede
        PasswordResetToken.objects.filter(user=user).delete()
        
        # generate token
        token = str(uuid.uuid4())
        print(f"✅ Token created: {token}")  # ← add this
        
        
        # save the token in the database
        PasswordResetToken.objects.create(user=user, token=token)
        
        # build the reset link
        reset_link = f"http://localhost:3000/reset-password?token={token}" 
        print(f"✅ Reset link: {reset_link}")  # ← add this
        
        # send the email
        send_mail(
            subject="Reset Your account Password",
            message=f"Hello {user.first_name},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.",
            from_email="edumetric.plattform2026@gmail.com",  # el email el 3amlto f settings.py
            recipient_list=[user.email],
        )
        print(f"✅ Email sent to: {user.email}")  # ← add this
        
        return JsonResponse({"message": "If this email exists, a reset link has been sent"})
    
    
    except Exception as mail_error:
        print(f"❌ Email failed: {mail_error}")  # ← add this
        return JsonResponse({"error": str(mail_error)}, status=500)


#  eh el user hy3mlo b3d ma y click 3la el link hay3ml new password f page el reset password
@csrf_exempt
def reset_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        token = data.get("token")
        new_password = data.get("password")
        
        if not token or not new_password:
            return JsonResponse({"error": "password is required"}, status=400)
        
        # find the token in the database
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return JsonResponse({"error": "Invalid or expired link"}, status=400)
        
        # check if token is still valid (not older than 1 hour)
        if not reset_token.is_valid():
            reset_token.delete()  # clean up expired token
            return JsonResponse({"error": "This link has expired. Please request a new one"}, status=400)
        
        # lazem a match el token b el user 34an a3ml reset ll password bta3t el user da
        user = reset_token.user
        user.set_password(new_password)
        user.save()  #34an tem4y m3 django built in user model w el password hashing bta3to
        
        # lazem amsa7 el token f a5er el process 34an m4 y3ml reset tany b nafs el token da
        reset_token.delete()
        
        return JsonResponse({"message": "Password reset successfully!",
                             "redirect": "/login" # h5ly el user yroh ll login page 3la tool b3d ma y3ml reset ll password bta3o
                         })

    except Exception as e: 
        return JsonResponse({"error": str(e)}, status=500)
    
# confirming the email address view and saving the user as active in the database 34an y2dar ya3ml login ba3d kda
@csrf_exempt
def confirm_email(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        token = data.get("token")   # hna el token da hyb2a el code el 3mlna f el email w ba3d ma y click 3leha w yro7 ll page el confirmation hya5od el token da w yba3to l backend 34an a confirm el email bta3t el user da aw la2

        if not token:
            return JsonResponse({"error": "Token is required"}, status=400)
        
        # find the token in the database 34an a3rf a confirm el email bta3t el user da aw la2
        try:
            confirm_token = EmailConfirmationToken.objects.get(token=token)
        except EmailConfirmationToken.DoesNotExist:
            return JsonResponse({"error": "Invalid confirmation link"}, status=400)
        
        # check if token is still valid lw m4 valid h3ml delete ll token da w a2olo en el link da expired w y3ml register tany
        if not confirm_token.is_valid():
            confirm_token.delete()
            return JsonResponse({"error": "This link has expired. Please register again"}, status=400)
        
        # activate the user account
        user = confirm_token.user  # get the user linked to this token
        user.is_active = True      # set is_active to True
        user.save()                # save to database b3d ma a confirm el email bta3t el user da a3ml save ll data bta3to
        
        # delete the token so it can't be used again
        confirm_token.delete()
        
        return JsonResponse({"message": "Email confirmed successfully! You can now login."})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


#logout view
from django.contrib.auth import logout as auth_logout # function built in bthandel el el logout

@csrf_exempt
def logout(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    auth_logout(request) #built in fun bt delete el session mn el database w btms7 el session cookie mn el brawser w el token n el database
    return JsonResponse({"message": "Logged out successfully"})

