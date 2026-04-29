from django.shortcuts import render
import csv
import os
import json
import pandas as pd
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Question, Choice
from docx import Document
from django.db import transaction
# Create your views here.

from django.shortcuts import render, get_object_or_404, redirect
from .models import Question, Choice, Chapter

@csrf_exempt
def questions_list_api(request):
    questions = Question.objects.all().order_by("-id")
    data = []
    for q in questions:
        choices = list(q.choices.values("id", "text", "is_correct"))
        correct = next((c["text"] for c in choices if c["is_correct"]), "")
        data.append({
            "id":         q.id,
            "question":   q.text,
            "type":       q.question_type.upper(),
            "difficulty": q.difficulty.capitalize(),
            "chapter":    q.chapter.name if q.chapter else "",
            "subject":    q.chapter.subject if q.chapter else "",
            "options":    [c["text"] for c in choices],
            "answer":     correct if q.question_type == "mcq" else str(q.correct_tf_answer),
        })
    return JsonResponse(data, safe=False)


@csrf_exempt
def create_question_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body)

        chapter_name = data.get("chapter", "").strip()
        subject      = data.get("subject", "").strip()
        q_type       = data.get("type", "MCQ").lower()
        difficulty   = data.get("difficulty", "Easy").lower()

        chapter, _ = Chapter.objects.get_or_create(
            name=chapter_name,
            subject=subject
        )

        question = Question.objects.create(
            text=data.get("question", "").strip(),
            question_type=q_type,
            difficulty=difficulty,
            chapter=chapter,
        )

        if q_type == "mcq":
            options       = data.get("options", [])
            correct_index = data.get("correctIndex", 0)
            for i, text in enumerate(options):
                if text.strip():
                    Choice.objects.create(
                        question=question,
                        text=text.strip(),
                        is_correct=(i == correct_index)
                    )

        elif q_type == "tf":
            answer = data.get("answer", "True")
            question.correct_tf_answer = answer.lower() == "true"
            question.save()

        return JsonResponse({"message": "Question created", "id": question.id})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def update_question_api(request, question_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data     = json.loads(request.body)
        question = get_object_or_404(Question, id=question_id)

        chapter_name = data.get("chapter", "").strip()
        subject      = data.get("subject", "").strip()
        q_type       = data.get("type", "MCQ").lower()

        chapter, _ = Chapter.objects.get_or_create(
            name=chapter_name,
            subject=subject
        )

        question.text          = data.get("question", "").strip()
        question.question_type = q_type
        question.difficulty    = data.get("difficulty", "Easy").lower()
        question.chapter       = chapter
        question.save()

        if q_type == "mcq":
            question.choices.all().delete()
            options       = data.get("options", [])
            correct_index = data.get("correctIndex", 0)
            for i, text in enumerate(options):
                if text.strip():
                    Choice.objects.create(
                        question=question,
                        text=text.strip(),
                        is_correct=(i == correct_index)
                    )

        elif q_type == "tf":
            answer = data.get("answer", "True")
            question.correct_tf_answer = answer.lower() == "true"
            question.save()

        return JsonResponse({"message": "Question updated"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def delete_question_api(request, question_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE only"}, status=405)

    question = get_object_or_404(Question, id=question_id)
    question.delete()
    return JsonResponse({"message": "Question deleted"})



@csrf_exempt
def upload_questions(request):
    if request.method == "POST":

        file = request.FILES.get("file")

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        ext = os.path.splitext(file.name)[1].lower()

        try:
            if ext == ".docx":
                document = Document(file)
                full_text = []
                for para in document.paragraphs:
                    full_text.append(para.text)
                text = "\n".join(full_text)
                questions = text.split("---")
                for i, q in enumerate(questions):
                    if not q.strip():
                        continue
                    row = parse_docx_question(q)
                    process_row(row, request.user)

            else:
                return JsonResponse(
                    {"error": "Only Docx are allowed"},
                    status=400
                )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        # ← changed from redirect to JsonResponse
        return JsonResponse({"message": "Questions uploaded successfully"})

    return JsonResponse({"error": "POST only"}, status=405)

def process_row(row, user):
    chapter_name = str(row["chapter"]).strip()
    subject = str(row.get("subject", "")).strip()

    chapter, created = Chapter.objects.get_or_create(
        name=chapter_name,
        subject=subject
    )

    question = Question.objects.create(
        text=row["text"],
        question_type=row["question_type"],
        difficulty=row["difficulty"],
        chapter=chapter,
    )

    if row["question_type"] == "mcq":
        choices = row.get("choices") or [
            row.get("choice1"),
            row.get("choice2"),
            row.get("choice3"),
            row.get("choice4"),
        ]

        correct = int(row["correct"])

        for i, choice_text in enumerate(choices):
            if choice_text:
                Choice.objects.create(
                    question=question,
                    text=str(choice_text),
                    is_correct=(i == correct)
                )

    elif row["question_type"] == "tf":
        question.correct_tf_answer = str(row["correct"]).lower() == "true"
        question.save()


def parse_docx_question(text_block):
    lines = text_block.strip().split("\n")
    data = {}

    for line in lines:
        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        data[key.strip().lower()] = value.strip()

    return {
        "text":          data.get("question"),
        "question_type": data.get("type"),
        "difficulty":    data.get("difficulty"),
        "chapter":       data.get("chapter"),
        "subject":       data.get("subject"),
        "choice1":       data.get("choice1"),
        "choice2":       data.get("choice2"),
        "choice3":       data.get("choice3"),
        "choice4":       data.get("choice4"),
        "correct":       data.get("correct"),
    }


# hna de b2aa el finction el asasya ehna hnmshy 3la el format de  llmcq w tf w hhotha ll teacher
# Question: What is 2+2?
# Type: mcq
# Difficulty: easy
# Chapter: Algebra
# Subject: Math

# Choice1: 3
# Choice2: 4
# Choice3: 5
# Choice4: 6
# Correct: 1
# ---
# Question: The earth is flat
# Type: tf
# Difficulty: easy
# Chapter: Geography
# Subject: Science

# Correct: false