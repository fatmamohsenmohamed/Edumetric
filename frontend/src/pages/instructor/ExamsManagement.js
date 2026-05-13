import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAddCircleOutline, 
  MdSearch,
   MdVisibility, 
   MdEdit,
  MdDelete, 
  MdCheckCircle, 
  MdCancel, 
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
// ─── Mock Data  ─────────────────
const SAMPLE_EXAMS = [
  {
    id: 1,
    title: "Math Final Exam",
    subject: "Mathematics",
    duration: 60,
    easy_count: 5,
    medium_count: 3,
    hard_count: 2,
    max_attempts: 2,
    shuffle_questions: true,
    shuffle_choices: false,
    published: true,
  },
  {
    id: 2,
    title: "Physics Quiz",
    subject: "Physics",
    duration: 30,
    easy_count: 3,
    medium_count: 2,
    hard_count: 0,
    max_attempts: 1,
    shuffle_questions: false,
    shuffle_choices: false,
    published: false,
  },
  {
    id: 3,
    title: "Programming Midterm",
    subject: "Computer Science",
    duration: 90,
    easy_count: 4,
    medium_count: 4,
    hard_count: 4,
    max_attempts: 1,
    shuffle_questions: true,
    shuffle_choices: true,
    published: true,
  },
  {
    id: 4,
    title: "History Quiz",
    subject: "History",
    duration: 45,
    easy_count: 6,
    medium_count: 2,
    hard_count: 0,
    max_attempts: 3,
    shuffle_questions: false,
    shuffle_choices: false,
    published: false,
  },
  {
    id: 5,
    title: "Chemistry Final",
    subject: "Chemistry",
    duration: 75,
    easy_count: 3,
    medium_count: 5,
    hard_count: 4,
    max_attempts: 1,
    shuffle_questions: true,
    shuffle_choices: true,
    published: true,
  },
];

const PAGE_SIZE = 4;

// ─── Exam Detail Modal ────────────────────────────────────────
function ExamDetailModal({ exam, onClose }) {
  if (!exam) return null;

  const total = exam.easy_count + exam.medium_count + exam.hard_count;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold text-[#1e3a8a]">{exam.title}</h2>
            <p className="text-sm text-slate-500">{exam.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              exam.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
            }`}>
              {exam.published ? "Published" : "Draft"}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <MdClose className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Basic Info */}
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
              <p className="font-bold text-[#1e3a8a]">{exam.shuffle_questions ? "Yes" : "No"}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <p className="text-xs text-slate-500">Shuffle Choices</p>
              <p className="font-bold text-[#1e3a8a]">{exam.shuffle_choices ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Questions Breakdown */}
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-2">
              Questions Breakdown — Total: <span className="text-[#1e3a8a]">{total}</span>
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Easy</p>
                <p className="font-bold text-green-600 text-lg">{exam.easy_count}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Medium</p>
                <p className="font-bold text-yellow-600 text-lg">{exam.medium_count}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Hard</p>
                <p className="font-bold text-red-600 text-lg">{exam.hard_count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────
function EditModal({ exam, onClose, onSave }) {
  const [form, setForm] = useState({ ...exam });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : type === "number" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.title || form.title.length < 3) err.title = "Min 3 characters";
    if (!form.subject) err.subject = "Required";
    if (!form.duration || form.duration <= 0) err.duration = "Must be > 0";
    const total = Number(form.easy_count) + Number(form.medium_count) + Number(form.hard_count);
    if (total === 0) err.questions = "Add at least one question";
    return err;
  };

  const handleSave = () => {
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    onSave(form);
    onClose();
  };

  const total = Number(form.easy_count) + Number(form.medium_count) + Number(form.hard_count);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-[#1e3a8a]">Edit Exam</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <MdClose className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-600">Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              className={`w-full h-11 px-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-400" : "border-slate-200"}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Subject + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-600">Subject *</label>
              <input
                name="subject" value={form.subject} onChange={handleChange}
                className={`w-full h-11 px-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Duration (min) *</label>
              <input
                type="number" name="duration" value={form.duration} onChange={handleChange}
                className={`w-full h-11 px-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Questions Counts */}
          <div>
            <label className="text-sm font-medium text-slate-600">Questions by Difficulty *</label>
            <div className="grid grid-cols-3 gap-3 mt-1">
              {["easy", "medium", "hard"].map((lvl) => (
                <div key={lvl}>
                  <label className="text-xs text-slate-400 capitalize">{lvl}</label>
                  <input
                    type="number" name={`${lvl}_count`} value={form[`${lvl}_count`]}
                    onChange={handleChange} min={0}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                </div>
              ))}
            </div>
            {errors.questions && <p className="text-red-500 text-xs mt-1">{errors.questions}</p>}
            <p className="text-xs text-slate-400 mt-1">Total: <span className="font-semibold text-[#1e3a8a]">{total}</span></p>
          </div>

          {/* Max Attempts */}
          <div>
            <label className="text-sm font-medium text-slate-600">Max Attempts</label>
            <input
              type="number" name="max_attempts" value={form.max_attempts}
              onChange={handleChange} min={1}
              className="w-24 h-11 px-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center block"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            {[
              { name: "shuffle_questions", label: "Shuffle Questions" },
              { name: "shuffle_choices",   label: "Shuffle Choices" },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" name={name} checked={form[name]} onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-600">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-xl hover:bg-slate-300 transition text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e40af] transition text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function ExamsManagement() {
  const navigate = useNavigate();

  const [exams, setExams]             = useState(SAMPLE_EXAMS);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "published" | "draft" | ""
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewExam, setViewExam]       = useState(null);
  const [editExam, setEditExam]       = useState(null);

  // ── Filter + Search ──
  const filtered = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch = !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        !filterStatus ||
        (filterStatus === "published" && e.published) ||
        (filterStatus === "draft" && !e.published);
      return matchSearch && matchStatus;
    });
  }, [exams, search, filterStatus]);

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setCurrentPage(1);

  // ── Stats ──
  const publishedCount = exams.filter((e) => e.published).length;
  const draftCount     = exams.filter((e) => !e.published).length;

  // ── Actions ──
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    setExams((prev) => prev.filter((e) => e.id !== id));
    resetPage();
  };

  const handleTogglePublish = (id) => {
    setExams((prev) =>
      prev.map((e) => e.id === id ? { ...e, published: !e.published } : e)
    );
  };

  const handleSaveEdit = (updated) => {
    setExams((prev) => prev.map((e) => e.id === updated.id ? updated : e));
  };

  const totalQuestions = (exam) =>
    exam.easy_count + exam.medium_count + exam.hard_count;
   

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState(null);

  return (
    <div className="flex min-h-screen">
          <InstructorSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              user={user}
          />
      <div className="flex-1 bg-white p-6 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
            >
              <MdMenu />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">Exams Management</h1>
              <p className="text-sm text-gray-500">
                {exams.length} total · {publishedCount} published · {draftCount} drafts
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

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Exams",  value: exams.length,     color: "bg-blue-50  text-blue-700",   border: "border-blue-100" },
            { label: "Published",    value: publishedCount,   color: "bg-green-50 text-green-700",  border: "border-green-100" },
            { label: "Drafts",       value: draftCount,       color: "bg-slate-50 text-slate-600",  border: "border-slate-200" },
          ].map(({ label, value, color, border }) => (
            <div key={label} className={`p-4 rounded-2xl border ${border} ${color.split(" ")[0]}`}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color.split(" ")[1]}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── SEARCH + FILTER ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1">
            <MdSearch className="text-slate-400 shrink-0" />
            <input
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="bg-transparent w-full outline-none text-sm text-[#1e3a8a]"
            />
            {search && (
              <button onClick={() => { setSearch(""); resetPage(); }}>
                <MdClose className="text-slate-400 text-sm" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition text-sm font-medium ${
              filterStatus ? "bg-[#1e3a8a] text-white border-[#1e3a8a]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MdFilterList />
            {filterStatus ? `Filter: ${filterStatus}` : "Filter"}
          </button>
        </div>

        {/* ── FILTER PANEL ── */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
            <p className="text-sm font-medium text-slate-600">Status:</p>
            <div className="flex gap-2">
              {["", "published", "draft"].map((val) => (
                <button
                  key={val || "all"}
                  onClick={() => { setFilterStatus(val); resetPage(); }}
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

        {/* ── EXAMS LIST ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MdLibraryBooks className="text-5xl mx-auto mb-2 opacity-20" />
            <p className="font-medium">No exams found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((exam) => (
              <div
                key={exam.id}
                className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start gap-4">

                  {/* Left — Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1e3a8a] truncate">{exam.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                        exam.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {exam.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-0.5">{exam.subject}</p>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                        <MdTimer className="text-sm" /> {exam.duration} min
                      </span>
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full">
                        <MdQuiz className="text-sm" /> {totalQuestions(exam)} questions
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {exam.max_attempts} attempt{exam.max_attempts !== 1 ? "s" : ""}
                      </span>
                      {exam.shuffle_questions && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">Shuffled</span>
                      )}
                    </div>

                    {/* Questions breakdown */}
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-green-600">Easy: {exam.easy_count}</span>
                      <span className="text-yellow-600">Medium: {exam.medium_count}</span>
                      <span className="text-red-600">Hard: {exam.hard_count}</span>
                    </div>
                  </div>

                  {/* Right — Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* View */}
                    <button
                      onClick={() => setViewExam(exam)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      title="View Details"
                    >
                      <MdVisibility />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditExam(exam)}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                      title="Edit"
                    >
                      <MdEdit />
                    </button>

                    {/* Publish Toggle */}
                    <button
                      onClick={() => handleTogglePublish(exam.id)}
                      className={`p-2 rounded-lg transition ${
                        exam.published
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      title={exam.published ? "Unpublish" : "Publish"}
                    >
                      {exam.published ? <MdCancel /> : <MdCheckCircle />}
                    </button>

                    {/* Delete */}
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

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <MdChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <MdChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* ── MODALS ── */}
        <ExamDetailModal exam={viewExam} onClose={() => setViewExam(null)} />

        {editExam && (
          <EditModal
            exam={editExam}
            onClose={() => setEditExam(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
}