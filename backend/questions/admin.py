
from django.contrib import admin
from .models import Question, Choice, Chapter


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "text", "question_type", "difficulty", "chapter")
    list_filter = ("question_type", "difficulty", "chapter")
    search_fields = ("text",)
    inlines = [ChoiceInline]


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "subject")
    search_fields = ("name", "subject")


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "text", "question", "is_correct")
    list_filter = ("is_correct",)
    search_fields = ("text",)