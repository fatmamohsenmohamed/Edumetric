from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


# # @login_required
# def teacher_dashboard(request):
#     return HttpResponse("Welcome to the Teacher Dashboard!")