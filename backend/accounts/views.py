import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User #table el user f el models
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

#tokens imorts
import uuid # this generates random unique codes
from django.core.mail import send_mail
from .models import PasswordResetToken




@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body) 
        # 3shan a5ly el json dictionary
        # hgib kol el data mn el form w a5lyha variables  
        full_name = data.get("fullName") 
        email = data.get("email")
        user_type = data.get("userType")
        password = data.get("password")

    

        required_fields = [full_name, email, user_type, password, data.get("confirmPassword")]
        #  w h3ml loop hna 3shan alf 3la kol el fields w lw haga fadya hytl3 error 
        if any(field is None or field == "" for field in required_fields):
            return JsonResponse({"error": "All fields are required"}, status=400)

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)
        
        if data.get("password") != data.get("confirmPassword"):
            return JsonResponse({"error": "Passwords do not match"}, status=400)
        
        # if len(password) < 8:
        #     return JsonResponse({"error": "Password must be at least 8 characters"}, status=400)
        
        # if not re.search(r"[A-Z]", password):
        #     return JsonResponse({"error": "Password must contain at least one uppercase letter"}, status=400)

        # if not re.search(r"[0-9]", password):
        #     return JsonResponse({"error": "Password must contain at least one number"}, status=400)


        # Save to database
        user = User.objects.create(
            full_name=full_name.strip(),
            email=email.strip().lower(),
            user_type=user_type,
            password=make_password(password),  # Hash the password before saving
        )
        

        return JsonResponse({
            "message": "User registered successfully",
            "user_id": user.id,
            "email": user.email,
            "user_type": user.user_type
        })
  

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
########################################################################################################
# login view #

@csrf_exempt
# ❌ CSRF protection blocking your POST request
# Django by default blocks POST requests from frontend unless CSRF is handled.
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        required= [email, password]
        remember_me = data.get("remember_me")  #  lw 3ml check 3la remember me h5ly el session yfdl b3d ma y2fl el browser w lw msh 3ml check h5ly el session kill lma y2fl el browser bs

        #  w btdo loop hna 
        if email:
            email = email.strip().lower()
            required = [email, password]

        if any(x is None or x == "" for x in required):
            return JsonResponse({"error": "Email and password are required"}, status=400)

        # check user lw ml2nash el email hn2ol fy moshkle either d el pass aw fel email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid email or password"}, status=400)

        #lw el password msh sah 2oly brdo eno el 8alat fel email aw el password
        if not check_password(password, user.password):
            return JsonResponse({"error": "Invalid email or password"}, status=400)


        #remember me checkbox 
        request.session['user_id'] = user.id # 3shan a5ly el session y5ly el user m3aya 3la tool lma y3ml login
        if remember_me:
            request.session.set_expiry(1209600)  # 2 weeks
        else:
            request.session.set_expiry(0)  # expires on browser close

        return JsonResponse({
            "message": "Login successful",
            "user_id": user.id,
            "email": user.email,
            "user_type": user.user_type,
            "redirect": "/teacher_dashboard" if user.user_type == "teacher" else "/login" #shwya w h5lih yroh ll student dashboard bs lma n3mlha
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

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
        except User.DoesNotExist:
            return JsonResponse({"message": "a reset link has been sent"}) #hna m4 ha2olo en el email dosent exist 34an el hacking
        
        # delete ay token adema abl ma a3ml wa7da gdede
        PasswordResetToken.objects.filter(user=user).delete()
        
        # generate token
        token = str(uuid.uuid4())
        
        # save the token in the database
        PasswordResetToken.objects.create(user=user, token=token)
        
        # # build the reset link
        reset_link = f"http://localhost:3000/reset-password/{token}" # ha8yer el esm lw 3amlo el page b 7aga tanya
        
        # send the email
        send_mail(
            subject="Reset Your account Password",
            message=f"Hello {user.full_name},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.",
            from_email="edumetric.plattform2026@gmail.com",  # el email el 3amlto f settings.py
            recipient_list=[user.email],
        )
        
        return JsonResponse({"message": "If this email exists, a reset link has been sent"})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


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
        user.password = make_password(new_password)
        user.save()
        
        # lazem amsa7 el token f a5er el process 34an m4 y3ml reset tany b nafs el token da
        reset_token.delete()
        
        return JsonResponse({"message": "Password reset successfully!",
                             "redirect": "/login" # h5ly el user yroh ll login page 3la tool b3d ma y3ml reset ll password bta3o
                             })

    except Exception as e: 
        return JsonResponse({"error": str(e)}, status=500)