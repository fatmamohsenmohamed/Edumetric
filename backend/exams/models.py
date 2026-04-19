# from django.db import models
# from questions.models import Question

# # Create your models here.
# class Exam(models.Model):
#     title = models.CharField(max_length=255)
#     teacher = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)



# class ExamQuestion(models.Model):
#     exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)

#     # optional customization per exam
#     marks = models.IntegerField(default=1)
#     order = models.IntegerField()