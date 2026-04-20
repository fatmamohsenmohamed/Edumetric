from django.contrib import admin


from django.contrib import admin
from .models import Question, Choice, Chapter

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4  # number of empty choices shown

class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)
admin.site.register(Chapter)
admin.site.register(Choice) 
