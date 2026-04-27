import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {
  MdDashboard,
  MdCreate,
  MdLibraryBooks,
  MdBarChart,
  MdAssignment,
  MdSettings,
  MdNotifications,
  MdSearch,
  MdTrendingUp,
  MdTrendingDown,
  MdVisibility,
  MdAutoAwesome,
  MdMenuBook,
  MdAddCircleOutline,
  MdMenu,
  MdClose,
  MdLogout,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdEdit,
  MdDownload,
  MdHelp,
  MdChecklistRtl,
  MdWarning,
  MdGroup,
  MdSchool,
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

const NAV = [
  { label: "Dashboard", icon: MdDashboard, active: true },
  { label: "Create Exam", icon: MdCreate },
  { label: "Question Bank", icon: MdLibraryBooks },
  { label: "Analytics", icon: MdBarChart },
  { label: "Students", icon: MdGroup },
  { label: "Settings", icon: MdSettings },
];

const MENU_ITEMS = [
  { label: "My Profile", icon: MdPerson },
  { label: "Edit Profile", icon: MdEdit },
  { label: "Settings", icon: MdSettings },
  { label: "Download Reports", icon: MdDownload },
  { label: "Help & Support", icon: MdHelp },
];
const NOTIFICATIONS = [
  {
    id: 1,
    title: "Exam Submitted",
    message: "All students completed Mathematics exam",
    time: "2 hours ago",
    type: "success",
    icon: MdCheckCircle,
  },
  {
    id: 2,
    title: "New Submission",
    message: "5 students submitted their assignments",
    time: "5 hours ago",
    type: "info",
    icon: MdChecklistRtl,
  },
  {
    id: 3,
    title: "Low Performance",
    message: "3 students scored below 50% in Physics",
    time: "1 day ago",
    type: "warning",
    icon: MdWarning,
  },
  {
    id: 4,
    title: "Class Reminder",
    message: "Chemistry class starts tomorrow at 10 AM",
    time: "1 day ago",
    type: "warning",
    icon: MdWarning,
  },
];

const CustomTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div className="bg-white p-2 border border-slate-300 rounded-lg shadow-lg">
      <p className="text-sm font-semibold text-slate-900">{payload[0].name}</p>
      <p className="text-sm text-slate-700">{payload[0].value}</p>
    </div>
  ) : null;

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState(null); // ← add
  const [stats, setStats] = useState(null); // ← add
  const [exams, setExams] = useState([]); // ← add
  const [chartData, setChartData] = useState([]); // ← add
  const [difficulty, setDifficulty] = useState([]); // ← add
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await fetch("http://localhost:8000/api/logout/", {
            method: "POST",
            credentials: "include",
        });
    } catch (err) {
        console.error("Logout error:", err);
    }
    navigate("/login"); //han8yarha ll home page b3d ma y3mloha MOHEMMMM
};


  useEffect(() => {
    fetch("http://localhost:8000/api/me/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("User error:", err));

    fetch("http://localhost:8000/api/teacher/analytics/stats/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats error:", err));

    fetch("http://localhost:8000/api/teacher/analytics/recent-exams/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error("Exams error:", err));

    fetch(
      "http://localhost:8000/api/teacher/analytics/performance-over-time/",
      {
        credentials: "include",
      },
    )
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Chart error:", err));

    fetch("http://localhost:8000/api/teacher/analytics/difficulty/", {
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

  const ExamRow = ({ exam, i }) => (
    <div
      className={`grid grid-cols-[2fr_1fr_70px_90px_60px] gap-3 items-center px-4 py-4 rounded-xl hover:bg-[#1e3a8a]/5 text-sm ${i < exams.length - 1 ? "border-b border-slate-200" : ""}`}
    >
      <div className="font-medium text-[#1e3a8a]">{exam.name}</div>
      <div className="text-xs text-slate-500 hidden sm:block">{exam.date}</div>
      <div className="font-bold text-base text-[#1e3a8a]">{exam.students}</div>
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-300">
        <MdCheckCircle size={11} />
        Avg: {exam.avgScore}%
      </span>
      <button className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
        <MdVisibility size={12} />
        View
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold">
            E
          </div>
          <span className="font-bold text-lg text-[#1e3a8a]">EduMetric</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-slate-600"
          >
            <MdClose size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-[#1e3a8a] text-white shadow-lg" : "text-slate-600 hover:text-slate-900 hover:bg-[#1e3a8a]/10"}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1e3a8a]/5 border border-slate-200 hover:bg-[#1e3a8a]/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
              DR
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-[#1e3a8a]">
                {user?.full_name || "Teacher"}
              </p>
              <p className="text-xs text-slate-500">{user?.email || ""}</p>
            </div>
            <MdLogout size={16} className="text-slate-600" />
          </button>
        </div>
      </aside>

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
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all relative"
            >
              <MdNotifications size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl z-50 shadow-lg max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-200 bg-white sticky top-0">
                  <p className="text-sm font-semibold text-[#1e3a8a]">
                    Notifications
                  </p>
                </div>
                <div className="py-2">
                  {NOTIFICATIONS.map(
                    ({ id, title, message, time, type, icon: Icon }) => (
                      <div
                        key={id}
                        className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer ${type === "success" ? "border-l-4 border-l-emerald-500" : type === "warning" ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-blue-500"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 ${type === "success" ? "text-emerald-600" : type === "warning" ? "text-orange-600" : "text-blue-600"}`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">
                              {title}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {message}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              {time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
                DR
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.full_name || "Teacher"}
              </span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-slate-200 bg-[#1e3a8a]/5">
                  <p className="text-sm font-semibold text-[#1e3a8a]">
                    {user?.full_name || "Teacher"}
                  </p>
                  <p className="text-xs text-slate-500">
                    teacher@edumetric.com
                  </p>
                </div>
                <div className="py-2">
                  {MENU_ITEMS.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[#1e3a8a]/10 transition-all"
                    >
                      <Icon size={16} className="text-[#1e3a8a]" />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-200 py-2">
                  <button
                    onClick={() => navigate("/login")}
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
              Welcome back, {user?.full_name || "Dr."} 👋
            </h1>
            <p className="text-slate-600">
              Here is your teaching overview for this semester
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats && (
              <>
                <StatCard
                  label="Total Students"
                  value={stats.total_students}
                  icon={MdGroup}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
                <StatCard
                  label="Exams Created"
                  value={stats.total_exams}
                  icon={MdAssignment}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
                <StatCard
                  label="Avg Class Score"
                  value={`${stats.avg_score}%`}
                  icon={MdBarChart}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
                <StatCard
                  label="Pass Rate"
                  value={`${stats.pass_rate}%`}
                  icon={MdCheckCircle}
                  trend=""
                  up={true}
                  color="from-[#1e40af] to-[#1e3a8a]"
                />
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#1e3a8a] mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white hover:shadow-lg transition-all">
                <MdCreate size={16} />
                Create New Exam
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white hover:shadow-lg transition-all">
                <MdLibraryBooks size={16} />
                Question Bank
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1e3a8a]/10 border border-slate-300 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
                <MdGroup size={16} />
                View Students
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">
                Class Performance Over Time
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Average class score by month
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
                  <Bar
                    dataKey="avgScore"
                    fill="#1e3a8a"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">
                Question Difficulty
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Distribution in your question bank
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
                      <Cell key={i} fill={e.color} />
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
                  Your latest 6 created exams
                </p>
              </div>
              <button className="text-xs px-4 py-2 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
                View all exams
              </button>
            </div>
            <div className="grid grid-cols-[2fr_1fr_70px_90px_60px] gap-3 px-4 py-3 mb-2 border-b border-slate-200">
              {["Exam Name", "Date", "Students", "Avg Score", "Action"].map(
                (h, i) => (
                  <span
                    key={h}
                    className={`text-xs font-semibold uppercase text-slate-500 ${i === 1 ? "hidden sm:block" : ""}`}
                  >
                    {h}
                  </span>
                ),
              )}
            </div>
            {exams.map((exam, i) => (
              <ExamRow key={i} exam={exam} i={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
