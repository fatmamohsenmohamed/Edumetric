import random
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Exam, Submission, Answer
from questions.models import Question, Choice
from django.template.loader import get_template
from django.http import HttpResponse
from xhtml2pdf import pisa
from io import BytesIO
from django.contrib.auth.models import User

# @login_required
def create_exam(request):
    if request.method == "POST":

        easy_count   = int(request.POST.get("easy_count", 0))
        medium_count = int(request.POST.get("medium_count", 0))
        hard_count   = int(request.POST.get("hard_count", 0))

        if easy_count + medium_count + hard_count == 0:
            return render(request, "create_exam.html", {
                "error": "Select at least one question"
            })

        exam = Exam.objects.create(
            title=request.POST.get("title"),
            instructor=request.user if request.user.is_authenticated else User.objects.first(),  # ← fix for anonymous user
            duration_minutes=int(request.POST.get("duration_minutes", 60)),
            max_attempts=int(request.POST.get("max_attempts", 1)),
            shuffle_questions=request.POST.get("shuffle_questions") == "on",
            shuffle_choices=request.POST.get("shuffle_choices") == "on",
            is_published=True
        )

        picked_ids = set()
        picked = []

        for difficulty, count in [
            ("easy", easy_count),
            ("medium", medium_count),
            ("hard", hard_count)
        ]:
            if count > 0:
                pool = list(Question.objects.filter(difficulty=difficulty))

                available = [q for q in pool if q.id not in picked_ids]

                selected = random.sample(available, min(count, len(available)))

                picked.extend(selected)
                picked_ids.update(q.id for q in selected)

        exam.questions.set(picked)

        return redirect("take_exam", exam_id=exam.id)

    return render(request, "create_exam.html")

# @login_required
def take_exam(request, exam_id):
    exam = get_object_or_404(Exam, id=exam_id)

    questions = list(exam.questions.all())

    # shuffle questions
    if exam.shuffle_questions:
        random.shuffle(questions)

    # shuffle choices
    for q in questions:
        if exam.shuffle_choices and q.question_type == "mcq":
            q.shuffled_choices = list(q.choices.all())
            random.shuffle(q.shuffled_choices)
        else:
            q.shuffled_choices = q.choices.all()

    return render(request, "take_exam.html", {
        "exam": exam,
        "questions": questions
    })

# @login_required
def submit_exam(request, exam_id):
    exam = get_object_or_404(Exam, id=exam_id)

    if request.method == "POST":
        submission = Submission.objects.create(
            exam=exam,
            student=request.user if request.user.is_authenticated else User.objects.first(),  # ← fix for anonymous user

        )

        total = 0
        correct = 0

        for question in exam.questions.all():

            if question.question_type == "mcq":
                choice_id = request.POST.get(f"question_{question.id}")

                if choice_id:
                    choice = Choice.objects.get(id=choice_id)

                    Answer.objects.create(
                        submission=submission,
                        question=question,
                        selected_choice=choice
                    )

                    total += 1
                    if choice.is_correct:
                        correct += 1

            elif question.question_type == "tf":
                answer = request.POST.get(f"question_{question.id}")

                if answer is not None:
                    user_answer = answer.lower() == "true"

                    Answer.objects.create(
                        submission=submission,
                        question=question,
                        tf_answer=user_answer
                    )

                    total += 1
                    if user_answer == question.correct_tf_answer:
                        correct += 1

        # calculate score
        score = (correct / total) * 100 if total > 0 else 0
        submission.score = score
        submission.save()

        return redirect("exam_result", submission_id=submission.id)
    

    
# @login_required
def exam_result(request, submission_id):
    submission = get_object_or_404(Submission, id=submission_id)

    answers = Answer.objects.filter(submission=submission)

    return render(request, "exam_result.html", {
        "submission": submission,
        "answers": answers
    })



# @login_required
def export_result_pdf(request, submission_id):
    submission = get_object_or_404(Submission, id=submission_id)
    answers = Answer.objects.filter(submission=submission)

    template = get_template("result_pdf.html")

    html = template.render({
        "submission": submission,
        "answers": answers
    })

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="result_{submission.id}.pdf"'

    pisa_status = pisa.CreatePDF(
        BytesIO(html.encode("UTF-8")),
        dest=response
    )

    if pisa_status.err:
        return HttpResponse("Error generating PDF")

    return response

