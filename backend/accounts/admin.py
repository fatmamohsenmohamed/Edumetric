from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User
from .models import PasswordResetToken
from .models import EmailConfirmationToken 


admin.site.register(User)
admin.site.register(PasswordResetToken)
admin.site.register(EmailConfirmationToken)