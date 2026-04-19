# from django.db import models

# # Create your models here.

# class Question(models.Model):
#     QUESTION_TYPES = (
#         ('mcq', 'Multiple Choice'),
#         ('tf', 'True/False'),
#     )

#     text = models.TextField() #da el question nfso
#     question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
#     created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
#     correct_tf_answer = models.BooleanField(null=True, blank=True) #h7ot hna answer ay so2al t& f
#     difficulty = models.CharField(max_length=20, null=True, blank=True)
#     subject = models.CharField(max_length=100, null=True, blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.text[:50]

# class Choice(models.Model):
#     question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices") #fk 3shan arbot el question bl choices
#     text = models.CharField(max_length=255) # de el choices kolha
#     is_correct = models.BooleanField(default=False)