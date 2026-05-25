import React, { useState, useEffect, useRef } from "react";
import { MdDownload } from "react-icons/md";
import jsPDF from "jspdf";
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
  const [results, setResults] = useState(null);
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
  const handleDownloadPDF = () => {
    const { score, correct, total, percentage } = results;
    const passed = percentage >= 50;
    const answered = Object.keys(answers).length;
    const skipped = total - answered;
    const wrong = answered - correct;

    const pdf = new jsPDF("p", "mm", "a4");
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();
    const M = 14;
    const CW = W - M * 2;
    let y = 0;

    const checkY = (h) => {
      if (y + h > H - 15) {
        pdf.addPage();
        y = 18;
      }
    };

    // Header banner
    if (passed) pdf.setFillColor(16, 185, 129);
    else pdf.setFillColor(220, 38, 38);
    pdf.rect(0, 0, W, 46, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(38);
    pdf.text(`${percentage}%`, W / 2, 20, { align: "center" });
    pdf.setFontSize(11);
    pdf.text(
      passed ? "Great job! You passed!" : "Better luck next time!",
      W / 2,
      30,
      { align: "center" },
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.text(`${correct} correct out of ${total} total questions`, W / 2, 39, {
      align: "center",
    });
    y = 54;

    // Stats row
    const bw = (CW - 8) / 3;
    const statData = [
      {
        label: "Correct",
        value: correct,
        bgR: 240,
        bgG: 253,
        bgB: 244,
        brR: 52,
        brG: 211,
        brB: 153,
        tR: 22,
        tG: 163,
        tB: 74,
      },
      {
        label: "Wrong",
        value: wrong,
        bgR: 254,
        bgG: 242,
        bgB: 242,
        brR: 252,
        brG: 165,
        brB: 165,
        tR: 220,
        tG: 38,
        tB: 38,
      },
      {
        label: "Skipped",
        value: skipped,
        bgR: 255,
        bgG: 247,
        bgB: 237,
        brR: 253,
        brG: 186,
        brB: 116,
        tR: 234,
        tG: 88,
        tB: 12,
      },
    ];
    statData.forEach((s, i) => {
      const sx = M + i * (bw + 4);
      pdf.setFillColor(s.bgR, s.bgG, s.bgB);
      pdf.setDrawColor(s.brR, s.brG, s.brB);
      pdf.roundedRect(sx, y, bw, 22, 2, 2, "FD");
      pdf.setTextColor(s.tR, s.tG, s.tB);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(17);
      pdf.text(`${s.value}`, sx + bw / 2, y + 11, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(s.label, sx + bw / 2, y + 18, { align: "center" });
    });
    y += 30;

    // Question Review title
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Question Review", M, y);
    y += 8;

    // Questions — works with your backend structure (question.options is array of {id, text})
    (results.detailedQuestions || []).forEach((q, idx) => {
      const isCorrect = q.is_correct;
      const wasSkipped = !q.answered;

      // Build a uniform "options" list for both MCQ and TF
      const optionsList =
        q.type === "mcq"
          ? q.options
          : [
              {
                id: "true",
                text: "True",
                is_correct: q.correct_answer === "True",
                selected: q.student_answer === "True",
              },
              {
                id: "false",
                text: "False",
                is_correct: q.correct_answer === "False",
                selected: q.student_answer === "False",
              },
            ];

      const optH = 8;
      const qHeaderH = 14;
      const skippedNoteH = wasSkipped ? 7 : 0;
      const cardH = qHeaderH + optionsList.length * optH + skippedNoteH + 4;

      checkY(cardH);

      // Card background
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(M, y, CW, cardH, 2, 2, "FD");

      // Left color bar
      if (wasSkipped) pdf.setFillColor(148, 163, 184);
      else if (isCorrect) pdf.setFillColor(16, 185, 129);
      else pdf.setFillColor(239, 68, 68);
      pdf.rect(M, y, 3, cardH, "F");

      // Question number circle
      if (wasSkipped) pdf.setFillColor(148, 163, 184);
      else if (isCorrect) pdf.setFillColor(16, 185, 129);
      else pdf.setFillColor(239, 68, 68);
      pdf.circle(M + 11, y + 7, 4.5, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.text(`${idx + 1}`, M + 11, y + 8.5, { align: "center" });

      // Status badge
      const statusText = wasSkipped
        ? "Skipped"
        : isCorrect
          ? "Correct"
          : "Wrong";
      let bR = 148,
        bG = 163,
        bB = 184,
        btR = 71,
        btG = 85,
        btB = 105;
      if (!wasSkipped && isCorrect) {
        bR = 167;
        bG = 243;
        bB = 208;
        btR = 22;
        btG = 163;
        btB = 74;
      }
      if (!wasSkipped && !isCorrect) {
        bR = 254;
        bG = 202;
        bB = 202;
        btR = 185;
        btG = 28;
        btB = 28;
      }
      const badgeW = 20;
      pdf.setFillColor(bR, bG, bB);
      pdf.roundedRect(M + CW - badgeW - 3, y + 2.5, badgeW, 6, 1, 1, "F");
      pdf.setTextColor(btR, btG, btB);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.5);
      pdf.text(statusText, M + CW - badgeW / 2 - 3, y + 6.8, {
        align: "center",
      });

      // Question text
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      const qLines = pdf.splitTextToSize(q.text, CW - 50);
      pdf.text(qLines, M + 18, y + 8);

      let oy = y + qHeaderH;

      // Options
      optionsList.forEach((opt) => {
        const isRight = opt.is_correct;
        const isPicked = opt.selected;

        let obR = 248,
          obG = 250,
          obB = 252,
          oBrR = 203,
          oBrG = 213,
          oBrB = 225;
        let otR = 71,
          otG = 85,
          otB = 105;
        let lbl = "";

        if (isRight && isPicked) {
          obR = 240;
          obG = 253;
          obB = 244;
          oBrR = 52;
          oBrG = 211;
          oBrB = 153;
          otR = 6;
          otG = 95;
          otB = 70;
          lbl = "Your answer (correct)";
        } else if (isRight) {
          obR = 240;
          obG = 253;
          obB = 244;
          oBrR = 52;
          oBrG = 211;
          oBrB = 153;
          otR = 6;
          otG = 95;
          otB = 70;
          lbl = "Correct answer";
        } else if (isPicked) {
          obR = 254;
          obG = 242;
          obB = 242;
          oBrR = 252;
          oBrG = 165;
          oBrB = 165;
          otR = 127;
          otG = 29;
          otB = 29;
          lbl = "Your answer (wrong)";
        }

        pdf.setFillColor(obR, obG, obB);
        pdf.setDrawColor(oBrR, oBrG, oBrB);
        pdf.roundedRect(M + 6, oy, CW - 7, 6.5, 1, 1, "FD");
        pdf.setTextColor(otR, otG, otB);
        pdf.setFont("helvetica", isRight || isPicked ? "bold" : "normal");
        pdf.setFontSize(7.5);
        pdf.text(opt.text, M + 10, oy + 4.5);
        if (lbl) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(6.5);
          pdf.text(lbl, M + CW - 4, oy + 4.5, { align: "right" });
        }
        oy += optH;
      });

      // Skipped note showing the correct answer
      if (wasSkipped) {
        const correctText =
          q.type === "mcq"
            ? q.options.find((o) => o.is_correct)?.text || "—"
            : q.correct_answer;
        pdf.setTextColor(100, 116, 139);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(7);
        pdf.text(`Skipped — correct answer: ${correctText}`, M + 10, oy + 3);
      }

      y += cardH + 4;
    });

    // Footer on every page
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`${exam.title} — Exam Results`, M, H - 8);
      pdf.text(
        `Generated ${new Date().toLocaleDateString()}  |  Page ${i} of ${totalPages}`,
        W - M,
        H - 8,
        { align: "right" },
      );
    }

    pdf.save(`${exam.title}_Results.pdf`);
  };
  const handleSubmitExam = () => {
    if (submittedRef.current && examSubmitted) return;
    submittedRef.current = true;
    setExamSubmitted(true);

    fetch(`http://localhost:8000/api/submit/${id}/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answers }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        // After submission, fetch the detailed review
        let detailedQuestions = [];
        try {
          const detailRes = await fetch(
            `http://localhost:8000/api/my-results/${data.submission_id}/`,
            { credentials: "include" },
          );
          if (detailRes.ok) {
            const detail = await detailRes.json();
            detailedQuestions = detail.questions || [];
          }
        } catch (e) {
          console.error("Detail fetch failed:", e);
        }

        setResults({
          score: data.score,
          total: data.total,
          correct: data.correct,
          percentage: Math.round(data.score),
          examTitle: exam.title,
          certificate_issued: data.certificate_issued,
          detailedQuestions, // 👈 NEW
        });
      })
      .catch((err) => {
        console.error(err);
        submittedRef.current = false;
        setExamSubmitted(false);
      });
  };

  if (examSubmitted && !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white text-xl">
        Submitting Exam...
      </div>
    );
  }
  if (examSubmitted && results) {
    const { score, correct, total, percentage } = results; // 👈 add `correct`
    const passed = percentage >= 50;
    const answered = Object.keys(answers).length;
    const skipped = total - answered;
    const wrong = answered - correct;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-all"
            >
              <MdArrowBack size={20} className="text-[#1e3a8a]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#1e3a8a]">{exam.title}</h1>
              <p className="text-xs text-slate-500">Exam Results & Review</p>
            </div>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-bold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {passed ? "PASSED 🎉" : "FAILED ❌"}
          </span>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div
              className={`rounded-2xl p-8 shadow-lg text-white text-center ${passed ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-red-500 to-red-700"}`}
            >
              <div style={{ fontSize: "5rem", fontWeight: 900, lineHeight: 1 }}>
                {percentage}%
              </div>
              <p className="text-xl mt-2 font-semibold">
                {passed
                  ? "Great job! Keep it up 💪"
                  : "Don't give up, try again! 😤"}
              </p>
              <p className="text-sm mt-1 opacity-80">
                {correct} correct out of {total} total questions
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  emoji: "✅",
                  value: correct,
                  label: "Correct",
                  color: "text-emerald-600",
                },
                {
                  emoji: "❌",
                  value: wrong,
                  label: "Wrong",
                  color: "text-red-500",
                },
                {
                  emoji: "⏭️",
                  value: skipped,
                  label: "Skipped",
                  color: "text-orange-500",
                },
              ].map(({ emoji, value, label, color }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center"
                >
                  <div className="text-3xl mb-1">{emoji}</div>
                  <div className={`text-3xl font-bold ${color}`}>{value}</div>
                  <div className="text-sm text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="pb-10 flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                ← Go back to Dashboard
              </button>

              {results.certificate_issued && (
                <button
                  onClick={() =>
                    navigate("/certificate", {
                      state: {
                        student: exam.student_name || "Student",
                        subject: exam.subject,
                        score: percentage,
                        correct: results.correct,
                        total: total,
                        instructor: exam.instructor_name || "",
                        institution: exam.institution_name || "",
                        date: new Date().toISOString(),
                      },
                    })
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
                >
                  🏆 Get Certificate
                </button>
              )}

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold rounded-xl hover:bg-[#1e3a8a]/5 transition-all"
              >
                <MdDownload size={20} />
                Download PDF
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
