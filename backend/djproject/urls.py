from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("edu.urls")),
    path('api/', include('accounts.urls')),
    path('api/', include('questions.urls')),
    path ('api/', include('exams.urls')),
    path("auth/",   include("accounts.urls")),
    # path('api/', include('teacher.urls')),
    

]
