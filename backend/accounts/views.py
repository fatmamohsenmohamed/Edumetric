import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password




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


        # 💾 Save to database
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
        #  w btdo loop hna 
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
        email = email.strip().lower()


        # request.session['user_id'] = user.id

        return JsonResponse({
            "message": "Login successful",
            "user_id": user.id,
            "email": user.email,
            "user_type": user.user_type,
            "redirect": "/teacher_dashboard" if user.user_type == "teacher" else "/login" #shwya w h5lih yroh ll student dashboard bs lma n3mlha
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

