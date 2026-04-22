from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Chapter(models.Model): 
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
#w kda kda f id byt3ml lkol rowww
    def __str__(self):
        return f"{self.subject} - {self.name}"  

class Question(models.Model):
    QUESTION_TYPES = (
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
    )

    text = models.TextField() #da el question nfso
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    # created_by = models.ForeignKey(User, on_delete=models.CASCADE) #3shan nms7 kol el questions elly by user mo3ayan lama yms7 accounto
    correct_tf_answer = models.BooleanField(null=True, blank=True) #h7ot hna answer ay so2al t& f
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True) #fk ll chapter.id 3shan nrbot kol so2al f anhy chapter w bt3ml automatically column esmo chapter id fel question table

    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard')
        ]
    )
    # created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices") #related name de 3shan a2dar a3ml question.choices w ygebly el choices kolha elly m3mola ll question da bbsataaa de fk ll automatic id el byt3ml lkol question w byb2a esmo question_id
    text = models.CharField(max_length=255) # de el choices kolha
    is_correct = models.BooleanField(default=False)

