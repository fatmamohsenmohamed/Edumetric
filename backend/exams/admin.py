

from django.contrib import admin
from .models import Exam, Submission, Answer, Certificate, ExamPurchase


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("title", "subject", "instructor", "is_published", "is_public", "is_paid", "price")
    list_filter = ("is_published", "is_public", "is_paid", "subject")
    list_editable = ("is_published", "is_public", "is_paid", "price")
    search_fields = ("title", "subject", "instructor__username")


# admin.site.register(Submission)
# admin.site.register(Answer)
admin.site.register(Certificate)
admin.site.register(ExamPurchase)
# admin.site.register(Exam)
# admin.site.register(Answer)