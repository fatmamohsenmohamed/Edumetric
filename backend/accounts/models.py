import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone# this gives us the current time
from datetime import timedelta 


class Profile(models.Model):
    USER_TYPE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
    ]

    user      = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone     = models.CharField(max_length=20, blank=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default="student")

    def __str__(self):
        return f"{self.user.username} — {self.user_type}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


    
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
