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