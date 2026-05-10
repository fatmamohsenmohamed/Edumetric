import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdTimer,
  MdFlag,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdRadioButtonChecked,
  MdNavigateBefore,
  MdNavigateNext,
  MdSend,
} from "react-icons/md";

export default function TakeExam() {
  const [exam, setExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const submittedRef = useRef(false); // 🔥 Prevent multiple submissions
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/api/take/${id}/`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Failed to load exam");
          navigate(-1);
          return;
        }
        setExam(data);
        setTimeLeft(data.duration * 60);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (!exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  // 🔥 Auto-submit when time runs out (only once)
  useEffect(() => {
    if (timeLeft === 0 && exam && !submittedRef.current) {
      submittedRef.current = true;
      handleSubmitExam();
    }
  }, [timeLeft, exam]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔥 FIXED: Pass questionId as parameter
  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionId, // 🔥 String key to match backend
    }));
  };

  // 🔥 NEW: Handle True/False
  const handleTFAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: value,
    }));
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlagged(newFlagged);
  };

  const handleSubmitExam = () => {
    if (submittedRef.current && examSubmitted) return; // 🔥 Prevent double submit
    submittedRef.current = true;
    setExamSubmitted(true);

    // 🔥 FIXED URL: Use examId from params, not hardcoded 1
    fetch(`http://localhost:8000/api/submit/${id}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: answers,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate("/exam-results", {
          state: {
            score: data.score,
            total: data.total,
            correct: data.correct,
            examTitle: exam.title,
            percentage: Math.round(data.score),
          },
        });
      })
      .catch((err) => {
        console.error(err);
        submittedRef.current = false;
        setExamSubmitted(false);
      });
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white text-xl">
        Loading Exam...
      </div>
    );
  }
  if (!exam.questions || exam.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white text-xl">
        This exam has no questions.
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const isAnswered = String(question.id) in answers;
  const isFlagged = flagged.has(currentQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            <MdArrowBack size={20} className="text-[#1e3a8a]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1e3a8a]">{exam.title}</h1>
            <p className="text-xs text-slate-500">
              Question {currentQuestion + 1} of {exam.questions.length}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
            timeLeft > 300
              ? "bg-emerald-100 text-emerald-700"
              : timeLeft > 60
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700 animate-pulse"
          }`}
        >
          <MdTimer size={18} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {question.type === "mcq"
                      ? "Multiple Choice"
                      : "True / False"}
                  </span>
                  <h2 className="text-lg font-semibold text-slate-900 mt-1">
                    {question.text}
                  </h2>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                    isFlagged
                      ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <MdFlag size={20} />
                </button>
              </div>

              {/* 🔥 NEW: Handle MCQ and TF separately */}
              {question.type === "mcq" ? (
                <div className="space-y-3 mb-8">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(question.id, option.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        answers[String(question.id)] === option.id
                          ? "border-[#1e3a8a] bg-[#1e3a8a]/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-[#1e3a8a] flex-shrink-0">
                        {answers[String(question.id)] === option.id ? (
                          <MdRadioButtonChecked size={24} />
                        ) : (
                          <MdRadioButtonUnchecked size={24} />
                        )}
                      </div>
                      <span className="text-left font-medium text-slate-700">
                        {option.text}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  <button
                    onClick={() => handleTFAnswer(question.id, true)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      answers[String(question.id)] === true
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-medium text-slate-700">True</span>
                  </button>
                  <button
                    onClick={() => handleTFAnswer(question.id, false)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      answers[String(question.id)] === false
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-medium text-slate-700">False</span>
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <MdNavigateBefore size={18} />
                  Previous
                </button>
                <div className="text-sm text-slate-600">
                  {isAnswered ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <MdCheckCircle size={16} />
                      Answered
                    </span>
                  ) : (
                    <span className="text-orange-600">Not answered</span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(exam.questions.length - 1, currentQuestion + 1),
                    )
                  }
                  disabled={currentQuestion === exam.questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a8a] text-white hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <MdNavigateNext size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-72 bg-white border-l border-slate-200 p-6 overflow-y-auto hidden lg:block">
          <h3 className="font-bold text-[#1e3a8a] mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {exam.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all ${
                  idx === currentQuestion ? "ring-2 ring-[#1e3a8a]" : ""
                } ${
                  String(q.id) in answers
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                } ${flagged.has(idx) ? "border-2 border-orange-500" : ""}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300"></div>
              <span className="text-slate-700">
                Answered ({Object.keys(answers).length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300"></div>
              <span className="text-slate-700">
                Not Answered (
                {exam.questions.length - Object.keys(answers).length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-orange-500"></div>
              <span className="text-slate-700">Flagged ({flagged.size})</span>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full py-3 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MdSend size={16} />
            Submit Exam
          </button>
        </aside>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">
              Submit Exam?
            </h2>
            <p className="text-slate-600 mb-2">
              You have answered{" "}
              <span className="font-bold text-[#1e3a8a]">
                {Object.keys(answers).length}
              </span>{" "}
              out of{" "}
              <span className="font-bold text-[#1e3a8a]">
                {exam.questions.length}
              </span>{" "}
              questions.
            </p>
            {Object.keys(answers).length < exam.questions.length && (
              <p className="text-orange-600 text-sm mb-6">
                ⚠️ You have unanswered questions!
              </p>
            )}
            {Object.keys(answers).length === 0 && (
              <p className="text-red-600 text-sm mb-6">
                ⛔ You haven't answered any questions!
              </p>
            )}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitExam();
                }}
                className="w-full py-3 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Submit Now
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-all"
              >
                Continue Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
