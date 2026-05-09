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
    is_public = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)   
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)



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

class Certificate(models.Model):
    submission = models.OneToOneField(
        Submission,
        on_delete=models.CASCADE,
        related_name="certificate"
    )
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Certificate for {self.submission.student.first_name} - {self.submission.exam.title}"
    
class ExamPurchase(models.Model): #3sjhan lma el free users yshtro w y subscribe 3ndna
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="exam_purchases"
    )
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="purchases"
    )
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "exam")  # Same user can't buy the same exam twice

    def __str__(self):
        return f"{self.user.username} purchased {self.exam.title}"
    