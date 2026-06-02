def calibrate_question_difficulty(question, min_attempts=5):
    from exams.models import Answer  # local import avoids circular imports

    answers = Answer.objects.filter(question=question)
    total = answers.count()

    if total < min_attempts:
        return question.difficulty

    correct = 0
    for ans in answers:
        if question.question_type == "mcq":
            if ans.selected_choice and ans.selected_choice.is_correct:
                correct += 1
        elif question.question_type == "tf":
            if ans.tf_answer == question.correct_tf_answer:
                correct += 1

    correct_rate = correct / total

    if correct_rate >= 0.75:
        new_difficulty = "easy"
    elif correct_rate >= 0.40:
        new_difficulty = "medium"
    else:
        new_difficulty = "hard"

    if new_difficulty != question.difficulty:
        question.difficulty = new_difficulty
        question.save(update_fields=["difficulty"])

    return new_difficulty