import json # 🛑 OFTEN FORGOTTEN! Causes 500 error on random.shuffle()
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Exam, Submission, Answer, Certificate, ExamPurchase
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
from .models import Exam, Submission, Answer, Certificate, ExamPurchase
from questions.models import Question, Choice, Chapter
from accounts.models import InstitutionMember, Institution
from django.contrib.auth.models import User

import random
from functools import wraps
from .services.difficulty_calibration import calibrate_question_difficulty



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

        subject = request.POST.get("subject", "").strip().lower()

        exam = Exam.objects.create(
            title=request.POST.get("title"),
            instructor=request.user ,
            duration=int(request.POST.get("duration", 60)),
            subject = subject,
            max_attempts=int(request.POST.get("max_attempts", 1)),
            shuffle_questions=request.POST.get("shuffle_questions") == "on",
            shuffle_choices=request.POST.get("shuffle_choices") == "on",
            is_published=True,
            is_public=False
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
        membership = getattr(request.user, "institution_membership", None)
        return JsonResponse({
            "title": exam.title,
            "duration": exam.duration,
            "questions": result,
            "subject": exam.subject,
            "instructor_name": exam.instructor.get_full_name() or exam.instructor.username,  
            "institution_name": membership.institution.name if membership else "",           
            "student_name": request.user.get_full_name() or request.user.username,  
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

        
        if not request.user.is_authenticated:
            return JsonResponse(
                {"error": "You must be logged in to submit"},
                status=401
            )

        student = request.user

        
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
        score = (correct / total) * 100 if total > 0 else 0
        submission.score = score
        submission.save()

        for question in exam.questions.all():
            calibrate_question_difficulty(question)

        is_free_user = not hasattr(request.user, "institution_membership") or request.user.institution_membership is None

        should_issue_cert = score >= 60 and exam.is_paid and is_free_user

        if should_issue_cert:
            Certificate.objects.create(submission=submission)

        
        return JsonResponse({
            "score": score,
            "correct": correct,
            "total": total,
            "submission_id": submission.id , 
            "passed": score >= 60,                                
            "certificate_issued": should_issue_cert
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
                "is_paid": exam.is_paid,                                       
                "price": float(exam.price) if exam.is_paid else 0,             
                "is_purchased": (
                        ExamPurchase.objects.filter(user=user, exam=exam).exists()
                if exam.is_paid
                else True
    ),  
            })

        return JsonResponse({"exams": result})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Add at top with other imports (if not already there)
from .models import Exam, Submission, Answer
from questions.models import Question, Choice


@csrf_exempt
@api_login_required
def student_results(request):
    """List all exam submissions for the logged-in student."""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)

    try:
        submissions = (
            Submission.objects
            .filter(student=request.user)
            .select_related("exam")
            .order_by("-submitted_at")
        )

        data = []
        for sub in submissions:
            score = sub.score or 0
            data.append({
                "id": sub.id,
                "exam_id": sub.exam.id,
                "exam_title": sub.exam.title,
                "subject": sub.exam.subject or "—",
                "score": round(score, 2),
                "passed": score >= 60,
                "submitted_at": sub.submitted_at.strftime("%b %d, %Y"),
                "submitted_at_iso": sub.submitted_at.isoformat(),
                "question_count": sub.exam.questions.count(),
            })

        # Aggregate stats for the page header
        total = len(data)
        passed = sum(1 for d in data if d["passed"])
        avg = round(sum(d["score"] for d in data) / total, 2) if total else 0

        return JsonResponse({
            "results": data,
            "stats": {
                "total": total,
                "passed": passed,
                "failed": total - passed,
                "average": avg,
            },
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_login_required
def student_result_detail(request, submission_id):
    """Detailed view of a single submission - shows each question, the student's answer, and the correct answer."""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)

    try:
        submission = Submission.objects.select_related("exam").get(
            id=submission_id,
            student=request.user,  # 🔒 ensures students can only see their own submissions
        )
    except Submission.DoesNotExist:
        return JsonResponse({"error": "Submission not found"}, status=404)

    try:
        # Get all answers in this submission, keyed by question_id
        answers_qs = Answer.objects.filter(submission=submission).select_related(
            "question", "selected_choice"
        )
        answers_map = {a.question_id: a for a in answers_qs}

        questions_data = []
        for question in submission.exam.questions.all():
            ans = answers_map.get(question.id)

            if question.question_type == "mcq":
                correct_choice = question.choices.filter(is_correct=True).first()
                student_choice = ans.selected_choice if ans else None
                is_correct = bool(student_choice and student_choice.is_correct)

                questions_data.append({
                    "id": question.id,
                    "text": question.text,
                    "type": "mcq",
                    "difficulty": question.difficulty,
                    "options": [
                        {
                            "id": c.id,
                            "text": c.text,
                            "is_correct": c.is_correct,
                            "selected": student_choice and c.id == student_choice.id,
                        }
                        for c in question.choices.all()
                    ],
                    "correct_text": correct_choice.text if correct_choice else None,
                    "student_text": student_choice.text if student_choice else "Not answered",
                    "is_correct": is_correct,
                    "answered": ans is not None,
                })

            elif question.question_type == "tf":
                student_tf = ans.tf_answer if ans else None
                correct_tf = question.correct_tf_answer
                is_correct = (student_tf is not None) and (student_tf == correct_tf)

                questions_data.append({
                    "id": question.id,
                    "text": question.text,
                    "type": "tf",
                    "difficulty": question.difficulty,
                    "correct_answer": "True" if correct_tf else "False",
                    "student_answer": (
                        "Not answered" if student_tf is None
                        else ("True" if student_tf else "False")
                    ),
                    "is_correct": is_correct,
                    "answered": ans is not None,
                })

        score = submission.score or 0
        return JsonResponse({
            "submission_id": submission.id,
            "exam_title": submission.exam.title,
            "subject": submission.exam.subject or "—",
            "score": round(score, 2),
            "passed": score >= 60,
            "submitted_at": submission.submitted_at.strftime("%b %d, %Y at %I:%M %p"),
            "total_questions": len(questions_data),
            "correct_count": sum(1 for q in questions_data if q["is_correct"]),
            "questions": questions_data,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@api_login_required
def teacher_student_results(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)
    
    try:
        # get all exams where instructor is the logged in teacher
        # instructor is a ForeignKey field on the Exam model
        exams = Exam.objects.filter(instructor=request.user)
        
        results = []
        
        for exam in exams:
            # get all submissions for this exam
            # Submission has a ForeignKey to Exam
            submissions = Submission.objects.filter(exam=exam)
            
            for submission in submissions:
                # count correct answers
                correct_answers = Answer.objects.filter(
                    submission=submission,
                    selected_choice__is_correct=True
                ).count()
                
                # total questions in this exam
                total_questions = exam.questions.count()
                
                results.append({
                    # ✅ Get name from profile which stores full_name correctly
                    "student": submission.student.first_name or submission.student.profile.user.username,
                    "exam": exam.title,
                    "subject": exam.subject or "N/A",
                    "score": round(submission.score, 1) if submission.score is not None else 0,
                    "correct": correct_answers,
                    "total": total_questions,
                    "date": submission.submitted_at.strftime("%Y-%m-%d"),# hy7otely el date bta3 el you el a5d feh el exam
                })

                for submission in submissions:
                    print(f"Student: {submission.student.email}, Name: {submission.student.first_name}")
        
        return JsonResponse({"results": results})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@api_login_required
def teacher_exams_list(request):
    """List all exams created by the logged-in teacher."""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)

    if request.user.profile.user_type != "teacher":
        return JsonResponse({"error": "Only teachers can access this"}, status=403)

    exams = Exam.objects.filter(instructor=request.user).order_by("-id")

    data = []
    for exam in exams:
        questions = exam.questions.all()
        data.append({
            "id": exam.id,
            "title": exam.title,
            "subject": exam.subject or "—",
            "duration": exam.duration,
            "max_attempts": exam.max_attempts,
            "shuffle_questions": exam.shuffle_questions,
            "shuffle_choices": exam.shuffle_choices,
            "published": exam.is_published,
            "easy_count":   questions.filter(difficulty="easy").count(),
            "medium_count": questions.filter(difficulty="medium").count(),
            "hard_count":   questions.filter(difficulty="hard").count(),
        })

    return JsonResponse({"exams": data})


@csrf_exempt
@api_login_required
def teacher_delete_exam(request, exam_id):
    """Delete an exam (only the teacher who owns it can delete)."""
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE allowed"}, status=405)

    try:
        exam = Exam.objects.get(id=exam_id, instructor=request.user)
        exam.delete()
        return JsonResponse({"success": True})
    except Exam.DoesNotExist:
        return JsonResponse({"error": "Exam not found"}, status=404)
    


import os
import re
import requests



