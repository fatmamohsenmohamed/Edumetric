from django.urls import path
from .views import (
    upload_questions, questions_list_api, create_question_api,
    update_question_api, delete_question_api, generate_questions_ai
)

urlpatterns = [

    path("q/upload/",               upload_questions,      name="upload_questions"),

    # ── API endpoints for React ──
    path("questions/",                          questions_list_api,    name="questions_list_api"),
    path("questions/create/",                   create_question_api,   name="create_question_api"),
    path("questions/<int:question_id>/update/", update_question_api,   name="update_question_api"),
    path("questions/<int:question_id>/delete/", delete_question_api,   name="delete_question_api"),
     path("questions/ai-generate/", generate_questions_ai, name="ai_generate"),
]