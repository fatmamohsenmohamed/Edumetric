from django.urls import path
from .views import filter_questions, question_list, create_question, add_choices, \
question_detail, update_question, delete_question, filter_questions, upload_questions

urlpatterns = [
    path("ques/", question_list, name="question_list"),
    path("q/create/", create_question, name="create_question"),
    path("q/<int:question_id>/", question_detail, name="question_detail"),
    path("q/<int:question_id>/update/", update_question, name="update_question"),
    path("q/<int:question_id>/delete/", delete_question, name="delete_question"),
    path("q/filter/", filter_questions, name="filter_questions"),
    path("q/upload/", upload_questions, name="upload_questions"),
]