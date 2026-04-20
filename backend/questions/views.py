from django.shortcuts import render

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

    # TF questions do NOT use choices
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

    return render(request, "questions/add_choices.html", {
        "question": question
    })

def question_detail(request, question_id):
    question = get_object_or_404(Question, id=question_id)
    choices = question.choices.all()

    return render(request, "questions/question_detail.html", {
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

    return render(request, "questions/update_question.html", {
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

    return render(request, "questions/question_list.html", {
        "questions": questions
    })

