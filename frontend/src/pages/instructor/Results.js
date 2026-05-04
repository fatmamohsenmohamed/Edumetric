import { useState } from "react";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";

/* DATA */
const SAMPLE_RESULTS = [
  { id: 1, student: "Mariam", subject: "Web", score: 85, correct: 17, total: 20, date: "2026-05-03" },
  { id: 2, student: "Ahmed", subject: "Science", score: 60, correct: 12, total: 20, date: "2026-05-03" },
  { id: 3, student: "Fatma", subject: "Math", score: 92, correct: 23, total: 25, date: "2026-05-02" },
  { id: 4, student: "Nada", subject: "Web", score: 45, correct: 9, total: 20, date: "2026-05-01" },
  { id: 5, student: "Shahd", subject: "Science", score: 78, correct: 15, total: 20, date: "2026-05-03" },
];

export default function Results() {
  const [results] = useState(SAMPLE_RESULTS);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  /* FILTER + SORT */
  const filtered = results
    .filter((r) => r.student.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => subjectFilter === "all" || r.subject === subjectFilter)
    .filter((r) => {
      if (statusFilter === "pass") return r.score >= 50;
      if (statusFilter === "fail") return r.score < 50;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "name") return a.student.localeCompare(b.student);
      return 0;
    });

  /* STATS */
  const avg =
    results.reduce((s, r) => s + r.score, 0) / results.length;

  const highest = Math.max(...results.map((r) => r.score));

  const passRate = Math.round(
    (results.filter((r) => r.score >= 50).length / results.length) * 100
  );

  /* PRINT */
  const exportPDF = () => window.print();

  const barColor = (score) =>
    score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <Card className="p-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1e3a8a]">
            Results 
          </h1>
          <p className="text-sm text-slate-500">
            Analyze students performance
          </p>
        </div>

        <Button onClick={exportPDF}>
          Export PDF
        </Button>
      </Card>

      {/* FILTERS */}
      <Card className="p-4 flex flex-wrap gap-3 no-print">

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-xl text-sm"
        />

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="border px-3 py-2 rounded-xl text-sm"
        >
          <option value="all">All Subjects</option>
          <option value="Web">Web</option>
          <option value="Science">Science</option>
          <option value="Math">Math</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-xl text-sm"
        >
          <option value="all">All Status</option>
          <option value="pass">Passed</option>
          <option value="fail">Failed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded-xl text-sm"
        >
          <option value="score">Sort by Score</option>
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>

      </Card>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-xl font-bold">{results.length}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Average</p>
          <p className="text-xl font-bold text-blue-600">
            {avg.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Highest</p>
          <p className="text-xl font-bold text-green-600">
            {highest}%
          </p>
        </Card>

        <Card className="p-4 text-center">
            <p className="text-sm text-gray-500">Pass Rate</p>
            <p className="text-xl font-bold text-emerald-600">
            {passRate}%
            </p>
        </Card>
      </div>

      {/* TABLE */}
      <Card className="p-4" id="results-table">

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>#</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Progress</th>
              <th>Correct</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-b hover:bg-slate-50">

                <td className="py-2 text-slate-400">{i + 1}</td>
                <td className="py-2 font-medium">{r.student}</td>
                <td>{r.subject}</td>

                <td className="font-semibold">{r.score}%</td>

                <td>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${r.score}%`,
                        background: barColor(r.score),
                        height: "100%",
                      }}
                    />
                  </div>
                </td>

                <td className="text-slate-500">
                  {r.correct}/{r.total}
                </td>

                <td className="text-slate-500">{r.date}</td>

                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      r.score >= 50
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.score >= 50 ? "Passed" : "Failed"}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </Card>
    </div>
  );
}