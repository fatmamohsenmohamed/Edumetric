"""
URL configuration for djproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import register, login, reset_password, forgot_password ,confirm_email, me


urlpatterns = [
    path("register/", register),
    path("login/", login),  # Placeholder for login view
    path("confirm-email/", confirm_email),
    path("me/", me),  # View for retrieving user information

    path('forgot_password/',forgot_password), 
    path('reset_password/', reset_password),   
    path('confirm_email/', confirm_email),
]