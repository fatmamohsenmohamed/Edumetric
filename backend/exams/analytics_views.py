from django.db.models.functions import TruncMonth
from django.db.models import Avg, Count, Q
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Submission
from questions.models import Question
from exams.models import Exam, Submission, Answer


@login_required
def dashboard_stats(request):
    submissions = Submission.objects.filter(student=request.user)

    total     = submissions.count()
    avg_score = submissions.aggregate(avg=Avg('score'))['avg'] or 0
    passed    = submissions.filter(score__gte=50).count()
    failed    = submissions.filter(score__lt=50).count()

    return JsonResponse({
        "total_exams": total,
        "avg_score":   round(avg_score, 2),
        "passed":      passed,
        "failed":      failed,
    })


@login_required
def recent_exams(request):
    submissions = Submission.objects.filter(student=request.user)\
        .select_related('exam')\
        .order_by('-submitted_at')[:6]

    data = [
        {
            "name":   s.exam.title,
            "date":   s.submitted_at.strftime("%b %d, %Y"),
            "score":  s.score,
            "status": "passed" if s.score >= 50 else "failed",
        }
        for s in submissions
    ]

    return JsonResponse(data, safe=False)


@login_required
def performance_over_time(request):
    data = (
        Submission.objects
        .filter(student=request.user)
        .annotate(month=TruncMonth('submitted_at'))
        .values('month')
        .annotate(score=Avg('score'))
        .order_by('month')
    )

    result = [
        {
            "month": d['month'].strftime("%b"),
            "score": round(d['score'], 2)
        }
        for d in data
    ]

    return JsonResponse(result, safe=False)


@login_required
def difficulty_distribution(request):
    data = Question.objects.values('difficulty')\
        .annotate(value=Count('id'))

    result = [
        {"name": d['difficulty'].capitalize(), "value": d['value']}
        for d in data
    ]

    return JsonResponse(result, safe=False)

# teahcer////////////////////////////////


@login_required
def teacher_stats(request):
    exams = Exam.objects.filter(instructor=request.user)
    total_exams = exams.count()

    submissions = Submission.objects.filter(exam__instructor=request.user)
    total_students = submissions.values('student').distinct().count()
    avg_score = submissions.aggregate(avg=Avg('score'))['avg'] or 0
    passed = submissions.filter(score__gte=50).count()
    total = submissions.count()
    pass_rate = round((passed / total) * 100, 2) if total > 0 else 0

    return JsonResponse({
        "total_students": total_students,
        "total_exams":    total_exams,
        "avg_score":      round(avg_score, 2),
        "pass_rate":      pass_rate,
    })


@login_required
def teacher_recent_exams(request):
    exams = Exam.objects.filter(instructor=request.user).order_by('-id')[:6]

    data = []
    for exam in exams:
        submissions = Submission.objects.filter(exam=exam)
        avg = submissions.aggregate(avg=Avg('score'))['avg'] or 0
        data.append({
            "name":      exam.title,
            "date":      exam.id,
            "students":  submissions.count(),
            "avgScore":  round(avg, 2),
        })

    return JsonResponse(data, safe=False)


@login_required
def teacher_performance_over_time(request):
    data = (
        Submission.objects
        .filter(exam__instructor=request.user)
        .annotate(month=TruncMonth('submitted_at'))
        .values('month')
        .annotate(avgScore=Avg('score'))
        .order_by('month')
    )

    result = [
        {
            "month":    d['month'].strftime("%b"),
            "avgScore": round(d['avgScore'], 2)
        }
        for d in data
    ]

    return JsonResponse(result, safe=False)


@login_required
def teacher_difficulty(request):
    DIFFICULTY_COLORS = {
        "easy":   "#10b981",  # emerald — easy/passable
        "medium": "#f59e0b",  # amber — moderate caution
        "hard":   "#dc2626",  # red — challenging
    }

    exams = Exam.objects.filter(instructor=request.user)
    questions = Question.objects.filter(exam__in=exams)
    data = questions.values("difficulty").annotate(value=Count("id"))

    result = [
        {
            "name": d["difficulty"].capitalize(),
            "value": d["value"],
            "color": DIFFICULTY_COLORS.get(d["difficulty"], "#1e3a8a"),  # fallback navy
        }
        for d in data
    ]
    return JsonResponse(result, safe=False)