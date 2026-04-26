from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Chapter(models.Model): 
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
#w kda kda f id byt3ml lkol rowww
    def __str__(self):
        return f"{self.subject} - {self.name}"  

from django.db.models import Q

class Question(models.Model):
    QUESTION_TYPES = (
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
    )

    text = models.TextField()

    question_type = models.CharField(
        max_length=10,
        choices=QUESTION_TYPES,
        null=False
    )

    correct_tf_answer = models.BooleanField(null=True, blank=True)

    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True)

    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard')
        ],
        null=False
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="tf_answer_required",
                check=(
                    Q(question_type="tf", correct_tf_answer__isnull=False) |
                    Q(question_type="mcq")
                )
            )
        ]
class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices") #related name de 3shan a2dar a3ml question.choices w ygebly el choices kolha elly m3mola ll question da bbsataaa de fk ll automatic id el byt3ml lkol question w byb2a esmo question_id
    text = models.CharField(max_length=255) # de el choices kolha
    is_correct = models.BooleanField(default=False)

