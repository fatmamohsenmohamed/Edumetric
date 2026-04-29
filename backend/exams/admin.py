from django.contrib import admin
from .models import Exam, Submission, Answer
# Register your models here.
admin.site.register(Exam)
admin.site.register(Submission)
admin.site.register(Answer)