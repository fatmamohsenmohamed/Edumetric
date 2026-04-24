from django.db import models
from django.utils import timezone  # this gives us the current time
from datetime import timedelta  # this lets us add time (like "1 hour from now")




class User(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=50, choices= [('student', 'Student'), ('teacher', 'Teacher')])
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)  # BooleanField means True or False only # default=False means every new user starts as NOT active

    
#add the token model for password reset functionality

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # lazem a5do FK   # on_delete=CASCADE means if user is deleted, delete their tokens too
    token = models.CharField(max_length=100, unique=True)  
    created_at = models.DateTimeField(auto_now_add=True)   # automatically saves when the token was created
   
    def is_valid(self):
        return timezone.now() < self.created_at + timedelta(hours=1)  # token expires after 1 hour for security
    
# adding a token for email verification or email confirmation
class EmailConfirmationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True) # the random secret code sent in the email
    created_at = models.DateTimeField(auto_now_add=True) # automatically saves when token was created
    
    def is_valid(self):
        return timezone.now() < self.created_at + timedelta(hours=24) # token expires after 24 hours hna hanzawd el wa2t shwya 