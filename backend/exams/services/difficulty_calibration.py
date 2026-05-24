# exams/services/difficulty_calibration.py
"""
Adaptive Difficulty Calibration
Based on Item Response Theory principles — recalibrates question
difficulty using observed student performance data.
"""


def calibrate_question_difficulty(question, min_attempts=5):
    """
    Recalibrate a single question's difficulty based on student performance.

    Logic:
        correct_rate >= 75%  →  easy
        correct_rate >= 40%  →  medium
        correct_rate <  40%  →  hard

    Requires at least `min_attempts` answers before recalibrating
    (to avoid premature reclassification from noisy data).

    Returns the (possibly updated) difficulty.
    """
    from exams.models import Answer  # local import avoids circular imports

    answers = Answer.objects.filter(question=question)
    total = answers.count()

    # Need enough data before recalibrating
    if total < min_attempts:
        return question.difficulty

    # Count correct answers (handles both MCQ and True/False question types)
    correct = 0
    for ans in answers:
        if question.question_type == "mcq":
            if ans.selected_choice and ans.selected_choice.is_correct:
                correct += 1
        elif question.question_type == "tf":
            if ans.tf_answer == question.correct_tf_answer:
                correct += 1

    correct_rate = correct / total

    # Apply IRT-inspired difficulty thresholds
    if correct_rate >= 0.75:
        new_difficulty = "easy"
    elif correct_rate >= 0.40:
        new_difficulty = "medium"
    else:
        new_difficulty = "hard"

    # Only update DB if the classification actually changed
    if new_difficulty != question.difficulty:
        question.difficulty = new_difficulty
        question.save(update_fields=["difficulty"])

    return new_difficulty