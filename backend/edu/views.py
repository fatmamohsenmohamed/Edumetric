from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

@api_view(['POST'])
def register_user(request):
    data = request.data

    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    # 1. check empty fields
    if not full_name or not email or not password or not confirm_password:
        return Response({"error": "All fields are required"}, status=400)

    # 2. password match
    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=400)

    # 3. password strength
    if len(password) < 6:
        return Response({"error": "Password must be at least 6 characters"}, status=400)

    # 4. check if user exists
    if User.objects.filter(username=email).exists():
        return Response({"error": "User already exists"}, status=400)

    # 5. create user
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name
    )

    return Response({
        "message": "User created successfully",
        "email": email
    })


#login view

#data is the insereted data in the database
@api_view(['POST'])
def login_user(request):
    data = request.data

    email = data.get("email")
    password = data.get("password")

    # 1. check empty fields
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    # 2. check if user exists
    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=400)

    # 3. check password
    if not user.check_password(password):
        return Response({"error": "Invalid email or password"}, status=400)

    return Response({
        "message": "Login successful",
        "email": email
    })