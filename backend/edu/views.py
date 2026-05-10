from django.core.mail import EmailMessage, send_mail
from .models import ContactMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def about(request):
    data = {
        "project": "EduMetric",
        "description": "AI-powered learning platform for students and educators.",
        "mission": "To revolutionize learning with smart tools.",
        "vision": "To become a leading global education platform.",
        "team": [
            {"name": "Fatma Mohsen", "role": "Backend & System"},
            {"name": "Nada Elbehiry", "role": "Frontend"},
            {"name": "Ahmed Ihab", "role": "Frontend"},
            {"name": "Shahd Mahmoud", "role": "System"},
            {"name": "Mariam Yasser", "role": "Backend"},
            {"name": "Nadine Badr", "role": "Business"},
        ]
    }

    return JsonResponse(data)


# @csrf_exempt
# def contact(request):
#     if request.method == "POST":
#         data = json.loads(request.body or "{}")
        

#         ContactMessage.objects.create(
#             name=data.get("name"),
#             email=data.get("email"),
#             subject=data.get("subject"),
#             message=data.get("message"),
#         )

#         return JsonResponse({"message": "Saved successfully"})

#     return JsonResponse({"error": "Method not allowed"}, status=405)

# #contact page bs hasta5dem class tany 8er send email 34an m4 sha8al
# @csrf_exempt
# def contact(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Only POST allowed"}, status=405)
    
#     try:
#         data    = json.loads(request.body)
#         name    = data.get("name", "").strip()
#         email   = data.get("email", "").strip()
#         subject = data.get("subject", "").strip()
#         message = data.get("message", "").strip()
        
#         if not name or not email or not subject or not message:
#             return JsonResponse({"error": "All fields are required"}, status=400)
        
#         # EmailMessage is a class that gives more control than send_mail
#         email_message = EmailMessage(
#             subject=f"Contact Form: {subject}",
#             body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
#             from_email="edumetric.plattform2026@gmail.com",
#             to=["edumetric.plattform2026@gmail.com"],
#             reply_to=[email],  # ← when you reply it goes to the user's email
#         )
#         email_message.send()  # send() is a method on EmailMessage class
        
#         return JsonResponse({"message": "Message sent successfully!"})
    
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def contact(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    try:
        data    = json.loads(request.body)
        name    = data.get("name", "").strip()
        email   = data.get("email", "").strip()
        subject = data.get("subject", "").strip()
        message = data.get("message", "").strip()
        
        if not name or not email or not subject or not message:
            return JsonResponse({"error": "All fields are required"}, status=400)
        
        # Step 1  save to database 
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Step 2  send email 
        send_mail(
            subject=f"Contact Form: {subject}",
            message=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
            from_email="edumetric.plattform2026@gmail.com",
            recipient_list=["edumetric.plattform2026@gmail.com"],
        )
        
        return JsonResponse({"message": "Message sent successfully!"})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def pricing(request):
    plans = [
        {
            "title": "Basic",
            "price": "$10/mo",
            "features": [
                "Access to question bank",
                "Basic analytics",
                "Email support"
            ],
        },
        {
            "title": "Pro",
            "price": "$25/mo",
            "features": [
                "Everything in Basic",
                "AI-powered question generation",
                "Advanced analytics",
                "Priority support"
            ],
        },
        {
            "title": "Enterprise",
            "price": "$50/mo",
            "features": [
                "Everything in Pro",
                "Custom branding",
                "Team management",
                "Dedicated account manager"
            ],
        },
    ]

    return JsonResponse({"plans": plans})