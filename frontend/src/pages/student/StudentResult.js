import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdVisibility,
} from "react-icons/md";

export default function MyResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    average: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetch("http://localhost:8000/api/my-results/", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          setError(data.error || "Failed to load results");
          return;
        }
        setResults(data.results);
        setStats(data.stats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);
  const filteredResults = results
    .filter((r) => {
      if (filter === "passed") return r.passed;
      if (filter === "failed") return !r.passed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);

      // Safely parse dates with fallback
      const timeA = a.submitted_at_iso
        ? new Date(a.submitted_at_iso).getTime()
        : 0;
      const timeB = b.submitted_at_iso
        ? new Date(b.submitted_at_iso).getTime()
        : 0;

      // Handle invalid dates (NaN check)
      if (isNaN(timeA) && isNaN(timeB)) return 0;
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;

      return timeB - timeA;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/student")}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-900 mb-4 text-sm font-medium"
        >
          <MdArrowBack size={20} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-blue-900 mb-2">My Results</h1>
        <p className="text-slate-500 mb-6">
          Full history of your exam attempts
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Attempts"
            value={stats.total}
            color="bg-blue-900"
          />
          <StatCard label="Passed" value={stats.passed} color="bg-green-600" />
          <StatCard label="Failed" value={stats.failed} color="bg-red-500" />
          <StatCard
            label="Average Score"
            value={`${stats.average}%`}
            color="bg-amber-500"
          />
        </div>

        {/* Filter + Sort */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="flex gap-2">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterChip>
            <FilterChip
              active={filter === "passed"}
              onClick={() => setFilter("passed")}
            >
              Passed
            </FilterChip>
            <FilterChip
              active={filter === "failed"}
              onClick={() => setFilter("failed")}
            >
              Failed
            </FilterChip>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-slate-500">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
            >
              <option value="date">Date (newest first)</option>
              <option value="score">Score (highest first)</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {error && <div className="p-6 text-red-600 text-center">{error}</div>}
          {!error && filteredResults.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No results match this filter yet.
            </div>
          )}
          {!error && filteredResults.length > 0 && (
            <table className="w-full">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left p-4">Exam</th>
                  <th className="text-left p-4">Subject</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Score</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-medium text-slate-800">
                      {r.exam_title}
                    </td>
                    <td className="p-4 text-slate-600 capitalize">
                      {r.subject}
                    </td>
                    <td className="p-4 text-slate-600">{r.submitted_at}</td>
                    <td className="p-4 font-bold text-blue-900">{r.score}%</td>
                    <td className="p-4">
                      {r.passed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <MdCheckCircle size={14} /> Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <MdCancel size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/my-results/${r.id}`)}
                        className="inline-flex items-center gap-1 text-sm text-blue-900 font-medium hover:underline"
                      >
                        <MdVisibility size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}
      >
        <div className="w-3 h-3 rounded-full bg-white/40" />
      </div>
      <p className="text-2xl font-bold text-blue-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-blue-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
