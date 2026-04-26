from django.db.models.functions import TruncMonth
from django.db.models import Avg, Count, Q
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Submission
from questions.models import Question


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