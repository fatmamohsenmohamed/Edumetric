from django.urls import path
from . import views

urlpatterns = [
   
    path('stats/',            views.admin_stats),
    path('user-growth/',      views.admin_user_growth),
    path('user-distribution/',views.admin_user_distribution),
    path('users/',            views.admin_users),
    path('exams/',            views.admin_exams),
]