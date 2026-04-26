from django.urls import path
from . import views
from django.urls import path
from . import views
from .analytics_views import dashboard_stats, recent_exams, performance_over_time, difficulty_distribution  

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
]