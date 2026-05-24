import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAddCircleOutline,
  MdSearch,
  MdVisibility,
  MdDelete,
  MdLibraryBooks,
  MdFilterList,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdTimer,
  MdQuiz,
  MdMenu,
} from "react-icons/md";
import InstructorSidebar from "../components/InstructorSidebar";

const PAGE_SIZE = 4;

// ─── Exam Detail Modal (View only) ────────────────────────────
function ExamDetailModal({ exam, onClose }) {
  if (!exam) return null;
  const total = exam.easy_count + exam.medium_count + exam.hard_count;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold text-[#1e3a8a]">{exam.title}</h2>
            <p className="text-sm text-slate-500">{exam.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                exam.published
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {exam.published ? "Published" : "Draft"}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <MdClose className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-xl">
              <p className="text-xs text-slate-500">Duration</p>
              <p className="font-bold text-[#1e3a8a] flex items-center gap-1">
                <MdTimer className="text-sm" /> {exam.duration} min
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <p className="text-xs text-slate-500">Max Attempts</p>
              <p className="font-bold text-[#1e3a8a]">{exam.max_attempts}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <p className="text-xs text-slate-500">Shuffle Questions</p>
              <p className="font-bold text-[#1e3a8a]">
                {exam.shuffle_questions ? "Yes" : "No"}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <p className="text-xs text-slate-500">Shuffle Choices</p>
              <p className="font-bold text-[#1e3a8a]">
                {exam.shuffle_choices ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-600 mb-2">
              Questions Breakdown — Total:{" "}
              <span className="text-[#1e3a8a]">{total}</span>
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Easy</p>
                <p className="font-bold text-green-600 text-lg">
                  {exam.easy_count}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Medium</p>
                <p className="font-bold text-yellow-600 text-lg">
                  {exam.medium_count}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Hard</p>
                <p className="font-bold text-red-600 text-lg">
                  {exam.hard_count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function ExamsManagement() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewExam, setViewExam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState(null);

  // ── Fetch exams from backend ──
  useEffect(() => {
    fetch("http://localhost:8000/api/teacher/exams/", {
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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  // ── Filter + Search ──
  const filtered = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.subject || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        !filterStatus ||
        (filterStatus === "published" && e.published) ||
        (filterStatus === "draft" && !e.published);
      return matchSearch && matchStatus;
    });
  }, [exams, search, filterStatus]);

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const resetPage = () => setCurrentPage(1);

  // ── Stats ──
  const publishedCount = exams.filter((e) => e.published).length;
  const draftCount = exams.filter((e) => !e.published).length;

  // ── Delete action (calls backend) ──
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this exam? This action cannot be undone.",
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/teacher/exams/${id}/delete/`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete exam");
        return;
      }
      setExams((prev) => prev.filter((e) => e.id !== id));
      resetPage();
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const totalQuestions = (exam) =>
    exam.easy_count + exam.medium_count + exam.hard_count;

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <div className="flex-1 bg-white p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
            >
              <MdMenu />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">
                Exams Management
              </h1>
              <p className="text-sm text-gray-500">
                {exams.length} total · {publishedCount} published · {draftCount}{" "}
                drafts
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/questionbank")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-[#1e3a8a] rounded-xl hover:bg-slate-200 transition text-sm font-medium"
            >
              <MdLibraryBooks /> Question Bank
            </button>
            <button
              onClick={() => navigate("/createexam")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e40af] transition text-sm font-medium"
            >
              <MdAddCircleOutline /> Create Exam
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Exams",
              value: exams.length,
              color: "bg-blue-50 text-blue-700",
              border: "border-blue-100",
            },
            {
              label: "Published",
              value: publishedCount,
              color: "bg-green-50 text-green-700",
              border: "border-green-100",
            },
            {
              label: "Drafts",
              value: draftCount,
              color: "bg-slate-50 text-slate-600",
              border: "border-slate-200",
            },
          ].map(({ label, value, color, border }) => (
            <div
              key={label}
              className={`p-4 rounded-2xl border ${border} ${color.split(" ")[0]}`}
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color.split(" ")[1]}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1">
            <MdSearch className="text-slate-400 shrink-0" />
            <input
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="bg-transparent w-full outline-none text-sm text-[#1e3a8a]"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  resetPage();
                }}
              >
                <MdClose className="text-slate-400 text-sm" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition text-sm font-medium ${
              filterStatus
                ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MdFilterList />
            {filterStatus ? `Filter: ${filterStatus}` : "Filter"}
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
            <p className="text-sm font-medium text-slate-600">Status:</p>
            <div className="flex gap-2">
              {["", "published", "draft"].map((val) => (
                <button
                  key={val || "all"}
                  onClick={() => {
                    setFilterStatus(val);
                    resetPage();
                  }}
                  className={`px-4 py-1.5 rounded-xl text-sm capitalize transition ${
                    filterStatus === val
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {val || "All"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOADING / ERROR */}
        {loading && (
          <div className="text-center py-20 text-slate-400">
            Loading exams...
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-20 text-red-500">{error}</div>
        )}

        {/* EXAMS LIST */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <MdLibraryBooks className="text-5xl mx-auto mb-2 opacity-20" />
            <p className="font-medium">No exams found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {paginated.map((exam) => (
              <div
                key={exam.id}
                className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1e3a8a] truncate">
                        {exam.title}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                          exam.published
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {exam.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {exam.subject}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                        <MdTimer className="text-sm" /> {exam.duration} min
                      </span>
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full">
                        <MdQuiz className="text-sm" /> {totalQuestions(exam)}{" "}
                        questions
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {exam.max_attempts} attempt
                        {exam.max_attempts !== 1 ? "s" : ""}
                      </span>
                      {exam.shuffle_questions && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">
                          Shuffled
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-green-600">
                        Easy: {exam.easy_count}
                      </span>
                      <span className="text-yellow-600">
                        Medium: {exam.medium_count}
                      </span>
                      <span className="text-red-600">
                        Hard: {exam.hard_count}
                      </span>
                    </div>
                  </div>

                  {/* Actions: View + Delete only */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setViewExam(exam)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      title="View Details"
                    >
                      <MdVisibility />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <MdChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      page === currentPage
                        ? "bg-[#1e3a8a] text-white"
                        : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <MdChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* MODAL */}
        <ExamDetailModal exam={viewExam} onClose={() => setViewExam(null)} />
      </div>
    </div>
  );
}
