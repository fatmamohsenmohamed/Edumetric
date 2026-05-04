from django.urls import path
from .views import (
    upload_questions, questions_list_api, create_question_api,
    update_question_api, delete_question_api
)

urlpatterns = [
    # path("q/create/",               create_question,       name="create_question"),
    # path("q/<int:question_id>/",    question_detail,       name="question_detail"),
    # path("q/<int:question_id>/update/", update_question,   name="update_question"),
    # path("q/<int:question_id>/delete/", delete_question,   name="delete_question"),
    # path("q/filter/",               filter_questions,      name="filter_questions"),
    path("q/upload/",               upload_questions,      name="upload_questions"),

    # ── API endpoints for React ──
    path("questions/",                          questions_list_api,    name="questions_list_api"),
    path("questions/create/",                   create_question_api,   name="create_question_api"),
    path("questions/<int:question_id>/update/", update_question_api,   name="update_question_api"),
    path("questions/<int:question_id>/delete/", delete_question_api,   name="delete_question_api"),
]