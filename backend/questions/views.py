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

def question_list(request):
    questions = Question.objects.all().order_by("-created_at")
    return render(request, "questions/question_list.html", {
        "questions": questions
    })

def create_question(request):
    chapters = Chapter.objects.all()

    if request.method == "POST":
        Question.objects.create(
            text=request.POST["text"],
            question_type=request.POST["question_type"],
            difficulty=request.POST["difficulty"],
            chapter_id=request.POST["chapter"],
            created_by=request.user
        )
        return redirect("question_list")

    return render(request, "questions/create_question.html", {
        "chapters": chapters
    })

def add_choices(request, question_id):
    question = get_object_or_404(Question, id=question_id)

    # TF questions msh hnaa ana 3amla column esmo correct_tf_answer 3shan h7ot hna answer ay so2al t& f
    if question.question_type == "tf":
        return redirect("set_tf_answer", question_id=question.id)

    if request.method == "POST":
        choices_text = request.POST.getlist("choices")
        correct_index = int(request.POST["correct"])

        
        Choice.objects.filter(question=question).update(is_correct=False)

        for i, text in enumerate(choices_text):
            Choice.objects.create(
                question=question,
                text=text,
                is_correct=(i == correct_index)
            )

        return redirect("question_detail", question_id=question.id)

    return render(request, "d", {
        "question": question
    })
def set_tf_answer(request, question_id):
    question = get_object_or_404(Question, id=question_id)

    if question.question_type != "tf":
        return redirect("question_detail", question_id=question.id)

    if request.method == "POST":
        answer = request.POST.get("answer")

        # Convert string → boolean
        question.correct_tf_answer = (answer.lower() == "true")
        question.save()

        return redirect("question_detail", question_id=question.id)

    return render(request, "r", {
        "question": question
    })

def question_detail(request, question_id):
    question = get_object_or_404(Question, id=question_id)
    choices = question.choices.all()

    return render(request, "q", {
        "question": question,
        "choices": choices
    })

def update_question(request, question_id):
    question = get_object_or_404(Question, id=question_id, created_by=request.user)

    if request.method == "POST":
        question.text = request.POST["text"]
        question.difficulty = request.POST["difficulty"]
        question.chapter_id = request.POST["chapter"]
        question.save()

        return redirect("teacher")

    chapters = Chapter.objects.all()

    return render(request, "q", {
        "question": question,
        "chapters": chapters
    })
def delete_question(request, question_id):
    question = get_object_or_404(Question, id=question_id, created_by=request.user)
    question.delete()
    return redirect("teacher")

def filter_questions(request):
    questions = Question.objects.all()

    subject = request.GET.get("subject")
    q_type = request.GET.get("type")
    difficulty = request.GET.get("difficulty")

    if subject:
        questions = questions.filter(subject=subject)

    if q_type:
        questions = questions.filter(question_type=q_type)

    if difficulty:
        questions = questions.filter(difficulty=difficulty)

    return render(request, "r", {
        "questions": questions
    })




@csrf_exempt
def upload_questions(request):
    if request.method == "POST":

        file = request.FILES.get("file")

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        ext = os.path.splitext(file.name)[1].lower()

        try:

            # if ext == ".csv":
            #     decoded = file.read().decode("utf-8").splitlines()
            #     reader = csv.DictReader(decoded)

            #     for row in reader:
            #         process_row(row, request.user)

            # elif ext in [".xlsx", ".xls"]:
            #     df = pd.read_excel(file)

            #     for _, row in df.iterrows():
            #         process_row(row.to_dict(), request.user) 
#hh3ml taht function el parsing 3shan y3rf y2ra mn el docx
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
                    process_row(row, request.user) #nsaveee as dict b2a 3shan el process row y2ra mnha w y3mlha save 
            

            else:
                return JsonResponse(
                    {"error": "Only Docx are allowed"},
                    status=400
                )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return redirect("question_list")

    return render(request, "upload.html")


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
        chapter=chapter,   # blashhh n5liha bl idddd
        # created_by=user
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

def parse_docx_question(text_block):
    lines = text_block.strip().split("\n")
    data = {}

    for line in lines:
        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        data[key.strip().lower()] = value.strip()
    return {
        "text": data.get("question"),
        "question_type": data.get("type"),
        "difficulty": data.get("difficulty"),
        "chapter": data.get("chapter"),
        "subject": data.get("subject"),
        "choice1": data.get("choice1"),
        "choice2": data.get("choice2"),
        "choice3": data.get("choice3"),
        "choice4": data.get("choice4"),
        "correct": data.get("correct"),
    }