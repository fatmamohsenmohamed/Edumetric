from django.urls import path

from .views import admin_stats, admin_user_growth, admin_user_distribution, admin_users, admin_exams,admin_students,admin_teachers

urlpatterns = [

    path('stats/',admin_stats),
    path('user-growth/',admin_user_growth),
    path('user-distribution/',admin_user_distribution),
    path('users/',admin_users),
    path('exams/',admin_exams),
    path('students/',admin_students),
    path('teachers/', admin_teachers),
]