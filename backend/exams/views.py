import json # 🛑 OFTEN FORGOTTEN! Causes 500 error on random.shuffle()
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Exam, Submission, Answer
from questions.models import Question, Choice
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from questions.models import Question, Choice
from django.template.loader import get_template
from django.http import HttpResponse
from xhtml2pdf import pisa
from io import BytesIO
import random
from django.http import JsonResponse
from functools import wraps
from django.http import JsonResponse
from accounts.models import InstitutionMember

def api_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper
# If no valid session is found → request.user becomes an AnonymousUser instance (which has .is_authenticated = False).


@csrf_exempt
@api_login_required
def create_exam(request):
    try:

        if request.method != "POST":
            return JsonResponse({"error": "Only POST allowed"}, status=405)

        # Only institutional teachers can create exams
        if request.user.profile.user_type != "teacher":
            return JsonResponse(
                {"error": "Only teachers can create exams"},
                status=403
            )

        # 🔒 Teacher must belong to an institution
        membership = getattr(request.user, "institution_membership", None)
        if not membership:
            return JsonResponse(
                {"error": "Only institutional teachers can create exams"},
                status=403
            )

        easy_count = int(request.POST.get("easy_count", 0))
        medium_count = int(request.POST.get("medium_count", 0))
        hard_count = int(request.POST.get("hard_count", 0))

        if easy_count + medium_count + hard_count == 0:
            return JsonResponse({"error": "Select at least one question"}, status=400)

        subject = request.POST.get("subject")

        exam = Exam.objects.create(
            title=request.POST.get("title"),
            instructor=request.user ,
            duration=int(request.POST.get("duration", 60)),
            subject = request.POST.get("subject"),
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
                pool = Question.objects.filter(
                    difficulty=difficulty,
                    chapter__subject=subject
                )

                available = [q for q in pool if q.id not in picked_ids]

                if len(available) == 0:
                    continue

                selected = random.sample(available, min(count, len(available)))

                picked.extend(selected)
                picked_ids.update(q.id for q in selected)

        exam.questions.set(picked)

        return JsonResponse({
            "success": True,
            "exam_id": exam.id
        })

    except Exception as e:
        import traceback
        print(traceback.format_exc())  # 👈 shows real error in terminal

        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)
# @login_required

@csrf_exempt  # 🔥 REQUIRED for React frontend
@api_login_required
def take_exam(request, exam_id):
    try:
        exam = get_object_or_404(Exam, id=exam_id)


        if not exam.is_published:
            return JsonResponse(
                {"error": "This exam is not available"},
                status=403
            )


        if request.user.is_authenticated:
            attempts = Submission.objects.filter(
                exam=exam,
                student=request.user
            ).count()
            if attempts >= exam.max_attempts:
                return JsonResponse(
                    {"error": f"You have reached the maximum attempts ({exam.max_attempts})"},
                    status=403
                )

        questions = list(exam.questions.all())

        if exam.shuffle_questions:
            random.shuffle(questions)

        result = []

        for q in questions:
            if exam.shuffle_choices and q.question_type == "mcq":
                choices = list(q.choices.all())
                random.shuffle(choices)
            else:
                choices = list(q.choices.all())

            result.append({
                "id": q.id,
                "text": q.text,
                "type": q.question_type,
                "options": [
                    {"id": c.id, "text": c.text}
                    for c in choices
                ]
            })

        return JsonResponse({
            "title": exam.title,
            "duration": exam.duration,
            "questions": result
        })

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )


@csrf_exempt  # 🔥 REQUIRED for React frontend
@api_login_required
def submit_exam(request, exam_id):
    try:
        exam = get_object_or_404(Exam, id=exam_id)

        # 🔥 Parse body safely
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON"},
                status=400
            )

        answers = data.get("answers", {})

        if not answers:
            return JsonResponse(
                {"error": "No answers provided"},
                status=400
            )

        # 🔥 Get student safely
        if not request.user.is_authenticated:
            return JsonResponse(
                {"error": "You must be logged in to submit"},
                status=401
            )

        student = request.user

        # 🔥 Check max attempts again (double check)
        attempts = Submission.objects.filter(
            exam=exam,
            student=student
        ).count()
        if attempts >= exam.max_attempts:
            return JsonResponse(
                {"error": f"Maximum attempts ({exam.max_attempts}) reached"},
                status=403
            )

        # 🔥 Create submission
        submission = Submission.objects.create(
            exam=exam,
            student=student,
        )

        total = 0
        correct = 0

        for question in exam.questions.all():
            user_answer = answers.get(str(question.id))

            if user_answer is None:
                continue

            # MCQ
            if question.question_type == "mcq":
                try:
                    choice = Choice.objects.get(id=user_answer)

                    Answer.objects.create(
                        submission=submission,
                        question=question,
                        selected_choice=choice
                    )

                    total += 1
                    if choice.is_correct:
                        correct += 1

                except Choice.DoesNotExist:
                    continue

            # True/False
            elif question.question_type == "tf":
                # 🔥 Handle both boolean and string "true"/"false" from JS
                if isinstance(user_answer, str):
                    user_tf = user_answer.lower() == "true"
                else:
                    user_tf = bool(user_answer)

                Answer.objects.create(
                    submission=submission,
                    question=question,
                    tf_answer=user_tf
                )

                total += 1
                if user_tf == question.correct_tf_answer:
                    correct += 1

        score = (correct / total) * 100 if total > 0 else 0
        submission.score = score
        submission.save()

        return JsonResponse({
            "score": score,
            "correct": correct,
            "total": total,
            "submission_id": submission.id  # 🔥 Useful for results page
        })

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )
    

@api_login_required
def exam_result(request, submission_id):
    submission = get_object_or_404(Submission, id=submission_id)

    answers = Answer.objects.filter(submission=submission)

    return render(request, "exam_result.html", {
        "submission": submission,
        "answers": answers
    })



@api_login_required
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

@csrf_exempt
@api_login_required
@require_http_methods(["GET"])
def available_exams(request):
    """List exams a student can take."""
    try:
        user = request.user
        membership = getattr(user, "institution_membership", None)

        if membership:
            # Institutional student → exams from teachers in same institution
            instructor_ids = InstitutionMember.objects.filter(
                institution=membership.institution
            ).values_list("user_id", flat=True)

            exams_qs = Exam.objects.filter(
                is_published=True,
                instructor_id__in=instructor_ids,
            )
        else:
            # Free user → only exams marked as public
            exams_qs = Exam.objects.filter(
                is_published=True,
                is_public=True,
            )

        result = []
        for exam in exams_qs.order_by("-id"):
            attempts_used = Submission.objects.filter(
                exam=exam, student=user
            ).count()
            attempts_left = exam.max_attempts - attempts_used

            result.append({
                "id": exam.id,
                "title": exam.title,
                "subject": exam.subject,
                "duration": exam.duration,
                "question_count": exam.questions.count(),
                "max_attempts": exam.max_attempts,
                "attempts_used": attempts_used,
                "attempts_left": max(0, attempts_left),
                "can_take": attempts_left > 0,
                "instructor": exam.instructor.first_name or exam.instructor.username,
            })

        return JsonResponse({"exams": result})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)