
from django.urls import path
from .views import register, login, reset_password, forgot_password ,confirm_email, me,logout ,delete_account


urlpatterns = [
    path("register/", register),
    path("login/", login),  # Placeholder for login view
    path("me/", me),  # View for retrieving user information #eh daaa

    path('forgot_password/',forgot_password), 
    path('reset_password/', reset_password),   
    path('confirm-email/', confirm_email),
    path('logout/', logout),  
    path('delete-account/', delete_account),
]
