from django.urls import path
from . import views
from django.urls import path
from . import views
from .analytics_views import (dashboard_stats, recent_exams, performance_over_time, difficulty_distribution 
,teacher_difficulty,teacher_stats, teacher_recent_exams, teacher_performance_over_time   )
from .views import teacher_student_results

urlpatterns = [
    path("create/", views.create_exam, name="create_exam"),
    path("take/<int:exam_id>/", views.take_exam, name="take_exam"),
    path("submit/<int:exam_id>/", views.submit_exam, name="submit_exam"),
    path("result/<int:submission_id>/", views.exam_result, name="exam_result"),
    path("result/<int:submission_id>/pdf/", views.export_result_pdf, name="exam_result_pdf"),
    path("analytics/stats/", dashboard_stats),
    path("analytics/recent-exams/", recent_exams),
    path("analytics/performance-over-time/", performance_over_time),
    path("analytics/difficulty/", difficulty_distribution),
    path("teacher/analytics/stats/",                teacher_stats),
    path("teacher/analytics/recent-exams/",         teacher_recent_exams),
    path("teacher/analytics/performance-over-time/", teacher_performance_over_time),
    path("teacher/analytics/difficulty/",            teacher_difficulty),
    path("available/", views.available_exams, name="available_exams"),
    path("my-results/", views.student_results, name="student_results"),
    path("my-results/<int:submission_id>/", views.student_result_detail, name="student_result_detail"),
    path("teacher/results/", views.teacher_student_results), 
    path("teacher/exams/", views.teacher_exams_list, name="teacher_exams_list"),
    path("teacher/exams/<int:exam_id>/delete/", views.teacher_delete_exam, name="teacher_delete_exam"),

    path("teacher/results/", teacher_student_results), 
    
]