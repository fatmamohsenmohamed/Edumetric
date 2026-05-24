import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdCheckCircle, MdCancel } from "react-icons/md";

export default function ResultDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/my-results/${id}/`, {
      credentials: "include",
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          setError(json.error || "Failed to load");
          return;
        }
        setData(json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading submission...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600">{error || "Submission not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/my-results")}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-900 mb-4 text-sm font-medium"
        >
          <MdArrowBack size={20} /> Back to Results
        </button>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                {data.exam_title}
              </h1>
              <p className="text-slate-500 capitalize">{data.subject}</p>
              <p className="text-xs text-slate-400 mt-1">{data.submitted_at}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-900">{data.score}%</p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                  data.passed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data.passed ? "Passed" : "Failed"}
              </span>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-slate-600 border-t border-slate-100 pt-4">
            <span>
              Total Questions: <b>{data.total_questions}</b>
            </span>
            <span>
              Correct: <b className="text-green-600">{data.correct_count}</b>
            </span>
            <span>
              Incorrect:{" "}
              <b className="text-red-600">
                {data.total_questions - data.correct_count}
              </b>
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {data.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    q.is_correct
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{q.text}</p>
                  <span className="text-xs text-slate-400 capitalize">
                    {q.difficulty}
                  </span>
                </div>
                {q.is_correct ? (
                  <MdCheckCircle className="text-green-600" size={24} />
                ) : (
                  <MdCancel className="text-red-500" size={24} />
                )}
              </div>

              {q.type === "mcq" && (
                <div className="space-y-2 mt-3">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg text-sm border ${
                        opt.is_correct
                          ? "bg-green-50 border-green-200 text-green-900"
                          : opt.selected && !opt.is_correct
                            ? "bg-red-50 border-red-200 text-red-900"
                            : "bg-slate-50 border-slate-100 text-slate-600"
                      }`}
                    >
                      {opt.text}
                      {opt.is_correct && (
                        <span className="ml-2 text-xs font-medium">
                          ✓ Correct
                        </span>
                      )}
                      {opt.selected && !opt.is_correct && (
                        <span className="ml-2 text-xs font-medium">
                          Your answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {q.type === "tf" && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div
                    className={`p-3 rounded-lg text-sm border ${
                      q.correct_answer === q.student_answer &&
                      q.student_answer === "True"
                        ? "bg-green-50 border-green-200"
                        : q.correct_answer === "True"
                          ? "bg-green-50 border-green-200"
                          : q.student_answer === "True"
                            ? "bg-red-50 border-red-200"
                            : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <span className="font-medium">True</span>
                    {q.correct_answer === "True" && (
                      <span className="ml-2 text-xs text-green-700">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg text-sm border ${
                      q.correct_answer === q.student_answer &&
                      q.student_answer === "False"
                        ? "bg-green-50 border-green-200"
                        : q.correct_answer === "False"
                          ? "bg-green-50 border-green-200"
                          : q.student_answer === "False"
                            ? "bg-red-50 border-red-200"
                            : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <span className="font-medium">False</span>
                    {q.correct_answer === "False" && (
                      <span className="ml-2 text-xs text-green-700">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                  <p className="col-span-2 text-xs text-slate-500">
                    Your answer: <b>{q.student_answer}</b>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
