import { useState, useMemo , useEffect } from "react";
import {
  MdSearch, 
  MdFilterList, 
  MdClose, 
  MdChevronLeft,
  MdChevronRight, 
  MdPrint,
  MdTrendingUp, 
  MdPeople, 
  MdStar, 
  MdCheckCircle,
  MdMenu,
} from "react-icons/md";
import InstructorSidebar from "../components/InstructorSidebar";

// ─── Sample Data ──────────────────────────────────────────────
// const SAMPLE_RESULTS = [
//   { id: 1,  student: "Mariam Ahmed",  subject: "Web Dev",  exam: "Midterm Exam",      score: 85, correct: 17, total: 20, date: "2026-05-03" },
//   { id: 2,  student: "Ahmed Ali",     subject: "Science",  exam: "Chapter 3 Quiz",    score: 60, correct: 12, total: 20, date: "2026-05-03" },
//   { id: 3,  student: "Fatma Hassan",  subject: "Math",     exam: "Final Exam",        score: 92, correct: 23, total: 25, date: "2026-05-02" },
//   { id: 4,  student: "Nada Mohamed",  subject: "Web Dev",  exam: "Midterm Exam",      score: 45, correct: 9,  total: 20, date: "2026-05-01" },
//   { id: 5,  student: "Shahd Omar",    subject: "Science",  exam: "Chapter 3 Quiz",    score: 78, correct: 15, total: 20, date: "2026-05-03" },
//   { id: 6,  student: "Youssef Tarek", subject: "Math",     exam: "Final Exam",        score: 55, correct: 14, total: 25, date: "2026-05-02" },
//   { id: 7,  student: "Sara Ibrahim",  subject: "CS",       exam: "Programming Quiz",  score: 96, correct: 24, total: 25, date: "2026-04-30" },
//   { id: 8,  student: "Karim Salah",   subject: "CS",       exam: "Programming Quiz",  score: 40, correct: 10, total: 25, date: "2026-04-30" },
//   { id: 9,  student: "Hana Magdy",    subject: "Web Dev",  exam: "Final Project",     score: 73, correct: 22, total: 30, date: "2026-04-28" },
//   { id: 10, student: "Omar Fathy",    subject: "Science",  exam: "Final Exam",        score: 88, correct: 22, total: 25, date: "2026-04-27" },
// ];

const PAGE_SIZE = 6;

// ─── Helpers ──────────────────────────────────────────────────
const barColor = (score) =>
  score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

const scoreTextColor = (score) =>
  score >= 70 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";

// ─── Main Component ───────────────────────────────────────────
export default function Results() {
  

  const [search, setSearch]           = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [sortBy, setSortBy]           = useState("score");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);


useEffect(() => {
   
  // ✅ Add this — fetch who is logged in
    fetch("http://localhost:8000/api/me/", {
        credentials: "include",
    })
    .then(res => {
        if (!res.ok) {
            // if not logged in → redirect to login
            window.location.href = "/login";
            return;
        }
        return res.json();
    })
    .then(data => setUser(data))
    .catch(err => console.error("User error:", err));

    // existing fetch
    fetch("http://localhost:8000/api/teacher/results/", {
        credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
        setResults(data.results || []);
        setLoading(false);
    })
    .catch(err => {
        console.error("Results error:", err);
        setLoading(false);
    });
}, []);

  // ── Unique subjects from data ──
  const allSubjects = useMemo(
    () => [...new Set(results.map((r) => r.subject))],
    [results]
  );

  // ── Filter + Sort ──
  const filtered = useMemo(() => {
    return results
      .filter((r) =>
        !search ||
        r.student.toLowerCase().includes(search.toLowerCase()) ||
        r.exam.toLowerCase().includes(search.toLowerCase())
      )
      .filter((r) => !subjectFilter || r.subject === subjectFilter)
      .filter((r) => {
        if (statusFilter === "pass") return r.score >= 50;
        if (statusFilter === "fail") return r.score < 50;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "score") return b.score - a.score;
        if (sortBy === "score_asc") return a.score - b.score;
        if (sortBy === "date")  return new Date(b.date) - new Date(a.date);
        if (sortBy === "name")  return a.student.localeCompare(b.student);
        return 0;
      });
  }, [search, subjectFilter, statusFilter, sortBy,results]);

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const resetPage  = () => setCurrentPage(1);

  // ── Stats ──
// ✅ Fix — check for empty array first
const avg = results.length > 0 ? results.reduce((s, r) => s + r.score, 0) / results.length : 0;
const highest = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;
const passRate = results.length > 0 ? Math.round((results.filter((r) => r.score >= 50).length / results.length) * 100) : 0;
const activeFiltersCount = [subjectFilter, statusFilter].filter(Boolean).length;

  // ── Print ──
  const handlePrint = () => window.print();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
      <div className="flex min-h-screen">

        <InstructorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />

      <div className="flex-1 bg-white p-6 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
            >
              <MdMenu />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">Results</h1>
              <p className="text-sm text-slate-500">
                {results.length} submissions · {filtered.length} shown
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="no-print flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e40af] transition text-sm font-medium"
          >
            <MdPrint /> Export PDF
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <MdPeople className="text-xl" />,      label: "Students",  value: results.length,    color: "text-blue-600",   bg: "bg-blue-50"   },
            { icon: <MdTrendingUp className="text-xl" />,  label: "Average",   value: `${avg.toFixed(1)}%`,     color: "text-purple-600", bg: "bg-purple-50" },
            { icon: <MdStar className="text-xl" />,        label: "Highest",   value: `${highest}%`,            color: "text-green-600",  bg: "bg-green-50"  },
            { icon: <MdCheckCircle className="text-xl" />, label: "Pass Rate", value: `${passRate}%`,           color: "text-emerald-600",bg: "bg-emerald-50"},
          ].map(({ icon, label, value, color, bg }) => (
            <div key={label} className={`${bg} p-4 rounded-2xl border border-white`}>
              <div className={`flex items-center gap-2 ${color} mb-1`}>
                {icon}
                <p className="text-xs font-medium text-slate-500">{label}</p>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── SEARCH + FILTER ── */}
        <div className="no-print flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1">
            <MdSearch className="text-slate-400 shrink-0" />
            <input
              placeholder="Search student or exam..."
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

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); resetPage(); }}
            className="border border-slate-200 px-3 py-2 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Score ↓</option>
            <option value="score_asc">Score ↑</option>
            <option value="date">Newest First</option>
            <option value="name">Name A–Z</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition text-sm font-medium ${
              activeFiltersCount > 0
                ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MdFilterList />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#1e3a8a] text-xs px-1.5 py-0.5 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* ── FILTER PANEL ── */}
        {showFilters && (
          <div className="no-print bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Subject */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Subject</label>
                <select
                  value={subjectFilter}
                  onChange={(e) => { setSubjectFilter(e.target.value); resetPage(); }}
                  className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  {allSubjects.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
                  className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="pass">Passed (≥ 50%)</option>
                  <option value="fail">Failed (&lt; 50%)</option>
                </select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => { setSubjectFilter(""); setStatusFilter(""); resetPage(); }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                ✕ Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── TABLE ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <MdSearch className="text-5xl mx-auto mb-2 opacity-20" />
            <p className="font-medium">No results found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["#", "Student", "Exam", "Subject", "Score", "Progress", "Correct", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginated.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>

                    <td className="px-4 py-3 font-medium text-[#1e3a8a]">
                      {r.student}
                    </td>

                    <td className="px-4 py-3 text-slate-600 max-w-[120px] truncate">
                      {r.exam}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {r.subject}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`font-bold ${scoreTextColor(r.score)}`}>
                        {r.score}%
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${r.score}%`, background: barColor(r.score), height: "100%" }}
                          className="rounded-full transition-all"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {r.correct}/{r.total}
                    </td>

                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        r.score >= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {r.score >= 50 ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="no-print flex items-center justify-between pt-2">
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

      </div>
      </div>
    </>
  );
}