import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdTimer,
  MdAssignment,
  MdPlayArrow,
  MdSchool,
  MdLock,
  MdPerson,
} from "react-icons/md";

export default function AvailableExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/available/", {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          setError(data.error || "Failed to load exams");
          return;
        }
        setExams(data.exams);
      })
      .catch(() => setError("Server error"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white">
        <div className="text-xl">Loading exams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button
          onClick={() => navigate("/student")}
          className="p-2 rounded-lg hover:bg-slate-100 transition-all"
        >
          <MdArrowBack size={20} className="text-[#1e3a8a]" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1e3a8a]">Available Exams</h1>
          <p className="text-xs text-slate-500">
            {exams.length} exam{exams.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!error && exams.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <MdSchool size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">
              No exams available right now
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Check back later when your instructor publishes new exams.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onStart={() => navigate(`/takeexam/${exam.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function ExamCard({ exam, onStart }) {
  const locked = !exam.can_take;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <h3 className="font-bold text-lg text-[#1e3a8a]">{exam.title}</h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MdPerson size={12} />
            {exam.subject} • by {exam.instructor}
          </p>
        </div>
        {locked && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
            <MdLock size={12} />
            Locked
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 my-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <MdTimer size={16} className="text-[#1e3a8a]" />
          <span>{exam.duration} min</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MdAssignment size={16} className="text-[#1e3a8a]" />
          <span>{exam.question_count} questions</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          Attempts: {exam.attempts_used} / {exam.max_attempts}
        </span>
        <button
          onClick={onStart}
          disabled={locked}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all
            ${
              locked
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white hover:shadow-lg"
            }`}
        >
          <MdPlayArrow size={16} />
          {locked ? "No attempts left" : "Start Exam"}
        </button>
      </div>
    </div>
  );
}
