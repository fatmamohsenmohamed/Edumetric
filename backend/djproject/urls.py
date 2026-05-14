from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('accounts.urls')),   # accounts first hna el awl 34an fy func el me7tagenha
    path('api/', include('questions.urls')),
    path('api/', include('exams.urls')),
    path('api/admins/', include('admins.urls')),
    path("api/", include("edu.urls")),        # edu last fyha function contact bs bt3ml save bs ll message m4 btb3tha
]
