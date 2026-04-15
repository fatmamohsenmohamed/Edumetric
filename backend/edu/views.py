from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response


@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body) 
        # 3shan a5ly el json dictionary

        full_name = data.get("fullName") 
        email = data.get("email")
        user_type = data.get("userType")
        password = data.get("password")
    

        if not full_name or not email or not user_type or not password:
            return JsonResponse({"error": "All fields are required"}, status=400)

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)
        
        if data.get("password") != data.get("confirmPassword"):
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        # 💾 Save to database
        user = User.objects.create(
            full_name=full_name,
            email=email,
            user_type=user_type,
            password=password,
        )
        

        return JsonResponse({
            "message": "User registered successfully",
            "user_id": user.id
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

from django.http import JsonResponse
import json
from .models import User

def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)

        # check user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid email or password"}, status=400)

        # check password
        if user.password != password:
            return JsonResponse({"error": "Invalid email or password"}, status=400)

        return JsonResponse({
            "message": "Login successful",
            "user_id": user.id,
            "email": user.email
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
