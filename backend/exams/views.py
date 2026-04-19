# from django.shortcuts import render

# # Create your views here.
# from django.shortcuts import render, redirect, get_object_or_404
# from exams.models import Exam, ExamQuestion
# from questions.models import Question
# def add_questions_to_exam(request, exam_id):
#     exam = get_object_or_404(Exam, id=exam_id)

#     if request.method == "POST":
#         selected_questions = request.POST.getlist("questions")

#         for q_id in selected_questions:
#             question = Question.objects.get(id=q_id)

#             ExamQuestion.objects.create(
#                 exam=exam,
#                 question=question
#             )

#         return redirect("exam_detail", exam_id=exam.id)

#     # GET request → show question bank
#     questions = Question.objects.all()

#     return render(request, "questions/add_to_exam.html", {
#         "exam": exam,
#         "questions": questions
#     })