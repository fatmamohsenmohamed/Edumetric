
# Register your models here.
from django.contrib import admin

from .models import User, Profile
from .models import PasswordResetToken
from .models import EmailConfirmationToken 


admin.site.register(Profile)
admin.site.register(PasswordResetToken)
admin.site.register(EmailConfirmationToken)

