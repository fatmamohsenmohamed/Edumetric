import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MdBarChart,
  MdAssignment,
  MdSearch,
  MdTrendingUp,
  MdTrendingDown,
  MdVisibility,
  MdMenu,
  MdLogout,
  MdCheckCircle,
  MdCancel,
  MdDeleteForever,
} from "react-icons/md";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "../components/StudentSidbar";

const CustomTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div className="bg-white p-2 border border-slate-300 rounded-lg shadow-lg">
      <p className="text-sm font-semibold text-slate-900">{payload[0].name}</p>
      <p className="text-sm text-slate-700">{payload[0].value}</p>
    </div>
  ) : null;

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [user, setUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/"); // han3del dy bardo lma y3mlo el home page MOHEMMM
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/me/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("User error:", err));
    // Stats
    fetch("http://localhost:8000/api/analytics/stats/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats error:", err));

    // Recent exams
    fetch("http://localhost:8000/api/analytics/recent-exams/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error("Exams error:", err));

    // Performance chart
    fetch("http://localhost:8000/api/analytics/performance-over-time/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Chart error:", err));

    // Difficulty
    fetch("http://localhost:8000/api/analytics/difficulty/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDifficulty(data))
      .catch((err) => console.error("Difficulty error:", err));
  }, []);

  const StatCard = ({ label, value, icon: Icon, trend, up, color }) => (
    <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}>
          <Icon size={24} />
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${up ? "text-emerald-600 bg-emerald-100" : "text-orange-600 bg-orange-100"}`}
        >
          {up ? (
            <MdTrendingUp className="inline mr-1" size={12} />
          ) : (
            <MdTrendingDown className="inline mr-1" size={12} />
          )}
        </span>
      </div>
      <div className="text-3xl font-bold text-[#1e3a8a] mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-600 mb-2">{label}</div>
      <div className={`text-xs ${up ? "text-emerald-600" : "text-orange-600"}`}>
        {trend}
      </div>
    </div>
  );

  // Add this function — but we'll update it to call the backend
  const handleDeleteAccount = async () => {
    try {
      await fetch("http://localhost:8000/api/delete-account/", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeleteConfirmOpen(false);
    setProfileOpen(false);
    navigate("/");
  };

  const ExamRow = ({ exam, i, total }) => {
    const passed = exam.status === "passed";
    const scoreColor =
      exam.score >= 70
        ? "text-emerald-400"
        : exam.score >= 50
          ? "text-orange-400"
          : "text-red-400";
    return (
      <div
        className={`grid grid-cols-[2fr_1fr_70px_90px_60px] gap-3 items-center px-4 py-4 rounded-xl hover:bg-[#1e3a8a]/5 text-sm ${i < total - 1 ? "border-b border-slate-200" : ""}`}
      >
        <div className="font-medium text-[#1e3a8a]">{exam.name}</div>
        <div className="text-xs text-slate-500 hidden sm:block">{exam.date}</div>
        <div className={`font-bold text-base ${scoreColor}`}>{Number(exam.score).toFixed(1)}%</div>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${passed ? "text-emerald-700 bg-emerald-100 border-emerald-300" : "text-red-700 bg-red-100 border-red-300"}`}
        >
          {passed ? <MdCheckCircle size={11} /> : <MdCancel size={11} />}
          {passed ? "Passed" : "Failed"}
        </span>
        <button
          onClick={() => navigate("/my-results")}
          className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all"
        >
          <MdVisibility size={12} />
          View
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600"
          >
            <MdMenu size={22} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <MdSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search exams..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-[#1e3a8a] placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
                {user?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "S"}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.full_name || "Student"}
              </span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-slate-200 bg-[#1e3a8a]/5">
                  <p className="text-sm font-semibold text-[#1e3a8a]">
                    {user?.full_name || "Student"}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email || ""}</p>
                </div>
                <div className="border-t border-slate-200 py-2">
                  <button
                    onClick={() => { setProfileOpen(false); setDeleteConfirmOpen(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-700 hover:bg-red-100 transition-all font-semibold"
                  >
                    <MdDeleteForever size={16} />
                    Delete Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
                  >
                    <MdLogout size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2">
              Welcome back, {user?.full_name || "Student"} 👋
            </h1>
            <p className="text-slate-600">
              Here is your performance overview for this semester
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats && (
              <>
                <StatCard
                  label="Total Exams"
                  value={stats.total_exams}
                  icon={MdAssignment}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
                <StatCard
                  label="Average Score"
                  value={`${stats.avg_score}%`}
                  icon={MdBarChart}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
                <StatCard
                  label="Passed Exams"
                  value={stats.passed}
                  icon={MdCheckCircle}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
                <StatCard
                  label="Failed Exams"
                  value={stats.failed}
                  icon={MdCancel}
                  trend=""
                  up={false}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">
                Performance Over Time
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Average score by month
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(30,58,138,0.1)"
                  />
                  <XAxis dataKey="month" stroke="rgba(30,58,138,0.5)" />
                  <YAxis stroke="rgba(30,58,138,0.5)" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">
                Difficulty Distribution
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Breakdown of your question pool
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={difficulty}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {difficulty.map((e, i) => (
                      <Cell
                        key={i}
                        fill={["#10b981", "#1e3a8a", "#dc2626"][i % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ color: "#1e3a8a", paddingTop: "16px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">
                  Recent Exams
                </h2>
                <p className="text-sm text-slate-500">
                  Your latest 6 exam attempts
                </p>
              </div>
              <button
                onClick={() => navigate("/my-results")}
                className="text-xs px-4 py-2 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-[2fr_1fr_70px_90px_60px] gap-3 px-4 py-3 mb-2 border-b border-slate-200">
              {["Exam Name", "Date", "Score", "Status", "Action"].map((h, i) => (
                <span
                  key={h}
                  className={`text-xs font-semibold uppercase text-slate-500 ${i === 1 ? "hidden sm:block" : ""}`}
                >
                  {h}
                </span>
              ))}
            </div>
            {exams.map((exam, i) => (
              <ExamRow key={i} exam={exam} i={i} total={exams.length} />
            ))}
          </div>
        </main>
      </div>

      {/*  Add modal here */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="bg-gradient-to-br from-red-600 to-red-800 px-6 pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdDeleteForever size={36} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete Account</h2>
              <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
            </div>
            <div className="px-6 py-6">
              <p className="text-slate-700 text-sm text-center leading-relaxed">
                Are you sure you want to permanently delete your account? All your exams and data will be{" "}
                <span className="font-semibold text-red-600">erased forever</span>.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MdDeleteForever size={18} />
                  Yes, Delete My Account
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}