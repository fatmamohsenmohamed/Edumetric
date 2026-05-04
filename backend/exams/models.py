# exams/models.py
from django.db import models
from django.contrib.auth.models import User
from questions.models import Question, Choice

class Exam(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100, null=True, blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    questions = models.ManyToManyField(Question)
    duration = models.IntegerField()
    max_attempts = models.IntegerField(default=1)
    shuffle_questions = models.BooleanField(default=True)
    shuffle_choices = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)



class Submission(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)


class Answer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, null=True, on_delete=models.SET_NULL)
    tf_answer = models.BooleanField(null=True)