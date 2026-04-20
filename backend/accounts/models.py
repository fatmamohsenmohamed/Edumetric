from django.db import models

# Create your models here.


class User(models.Model):
    USER_TYPES = (
    ('teacher', 'Teacher'),
    ('student', 'Student'),
    ('institution', 'Institution'),
)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=50, choices=USER_TYPES)
    password = models.CharField(max_length=100)

