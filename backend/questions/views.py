from django.shortcuts import render
import csv
import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Question, Choice
from django.db import transaction
from docx import Document
import requests
import re


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
        subject      = data.get("subject", "").strip().lower()
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
        subject      = data.get("subject", "").strip().lower()
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
    subject = str(row.get("subject", "")).strip().lower()

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
        "subject":       data.get("subject", "").lower().strip(),
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
@csrf_exempt
def generate_questions_ai(request):
    """Generate exam questions using Google Gemini AI."""
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body)
        subject = data.get("subject", "general").strip()
        topic = data.get("topic", "").strip()
        difficulty = data.get("difficulty", "medium").lower()
        count = min(max(int(data.get("count", 3)), 1), 10)

        if not topic:
            return JsonResponse({"error": "Topic is required"}, status=400)

        prompt = f"""Generate exactly {count} multiple-choice questions about "{topic}"
in the subject of "{subject}" at {difficulty} difficulty level.

IMPORTANT: Return ONLY valid JSON. No markdown formatting, no code fences, no explanations.

Format:
[
  {{
    "question": "the question text here",
    "options": ["option 1", "option 2", "option 3", "option 4"],
    "correct_index": 0
  }}
]

Rules:
- Each question must have exactly 4 options
- correct_index must be 0, 1, 2, or 3 (zero-indexed)
- Wrong options should be plausible but clearly incorrect
- Questions should be clear, unambiguous, and match the difficulty level
- Do not include any text before or after the JSON array"""

        # Get API key from environment variable (safer than hardcoding)
        api_key = "AQ.Ab8RN6Ic8fITgfQDvDfFw4XFwHhvmV6ttyJAKDP8cCN7y1giAA"
        if not api_key:
            return JsonResponse(
                {"error": "AI service not configured (missing API key)"},
                status=500,
            )

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/"
            f"models/gemini-2.5-flash:generateContent?key={api_key}"
        )

        ai_response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=30,
        )

        if ai_response.status_code != 200:
            print("=" * 50)
            print(f"GEMINI ERROR (status {ai_response.status_code}):")
            print(ai_response.text)
            print("=" * 50)
            return JsonResponse(
                {"error": f"AI service returned {ai_response.status_code}: {ai_response.text[:300]}"},
                status=500,
    )
        ai_text = ai_response.json()["candidates"][0]["content"]["parts"][0]["text"]

        # Clean up potential markdown wrapping
        ai_text = ai_text.strip()
        ai_text = re.sub(r"^```(?:json)?\s*", "", ai_text)
        ai_text = re.sub(r"\s*```$", "", ai_text)

        questions = json.loads(ai_text)

        # Validate structure
        cleaned = []
        for q in questions:
            if (
                isinstance(q, dict)
                and "question" in q
                and "options" in q
                and "correct_index" in q
                and len(q["options"]) == 4
                and 0 <= q["correct_index"] <= 3
            ):
                cleaned.append({
                    "question": str(q["question"]),
                    "options": [str(o) for o in q["options"]],
                    "correct_index": int(q["correct_index"]),
                })

        if not cleaned:
            return JsonResponse(
                {"error": "AI returned invalid format. Please try again."},
                status=500,
            )

        return JsonResponse({"questions": cleaned})

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "AI returned invalid JSON. Please try again."},
            status=500,
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
