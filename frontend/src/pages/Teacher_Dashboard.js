import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  { label: "Results", icon: MdAssignment },
  { label: "Settings", icon: MdSettings },
];
const STATS = [
  {
    label: "Total Exams",
    value: 48,
    icon: MdAssignment,
    trend: "+6 this month",
    up: true,
    color: "from-[#1e40af] to-[#1e3a8a]",
  },
  {
    label: "Average Score",
    value: "74%",
    icon: MdBarChart,
    trend: "+3.2% vs last month",
    up: true,
    color: "from-[#1e40af] to-[#1e3a8a]",
  },
  {
    label: "Passed Exams",
    value: 36,
    icon: MdCheckCircle,
    trend: "75% pass rate",
    up: true,
    color: "from-[#1e40af] to-[#1e3a8a]",
  },
  {
    label: "Failed Exams",
    value: 12,
    icon: MdCancel,
    trend: "-2 from last month",
    up: false,
    color: "from-[#1e40af] to-[#1e3a8a]",
  },
];
const EXAMS = [
  {
    name: "Mathematics — Calculus",
    date: "Apr 15, 2026",
    score: 88,
    status: "passed",
  },
  {
    name: "Physics — Mechanics",
    date: "Apr 10, 2026",
    score: 61,
    status: "failed",
  },
  {
    name: "Chemistry — Organic",
    date: "Apr 6, 2026",
    score: 79,
    status: "passed",
  },
  {
    name: "English Literature",
    date: "Mar 30, 2026",
    score: 92,
    status: "passed",
  },
  {
    name: "Data Structures",
    date: "Mar 24, 2026",
    score: 55,
    status: "failed",
  },
  { name: "Linear Algebra", date: "Mar 18, 2026", score: 83, status: "passed" },
];
const CHART_DATA = [
  { month: "Oct", score: 65 },
  { month: "Nov", score: 72 },
  { month: "Dec", score: 68 },
  { month: "Jan", score: 80 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 82 },
  { month: "Apr", score: 88 },
];
const DIFFICULTY = [
  { name: "Easy", value: 35, color: "#10b981" },
  { name: "Medium", value: 45, color: "#1e3a8a" },
  { name: "Hard", value: 20, color: "#dc2626" },
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
    title: "Exam Completed",
    message: "Your Mathematics exam has been graded",
    time: "2 hours ago",
    type: "success",
    icon: MdCheckCircle,
  },
  {
    id: 2,
    title: "New Assignment",
    message: "Physics assignment posted by instructor",
    time: "5 hours ago",
    type: "info",
    icon: MdChecklistRtl,
  },
  {
    id: 3,
    title: "Low Score Alert",
    message: "Your Data Structures score is below average",
    time: "1 day ago",
    type: "warning",
    icon: MdWarning,
  },
  {
    id: 4,
    title: "Exam Reminder",
    message: "Chemistry exam starts tomorrow at 10 AM",
    time: "1 day ago",
    type: "warning",
    icon: MdWarning,
  },
];
// Dashboard
// Create Exam
// Question Bank
// Analytics
// Results
// Settings
export default function Teacher_Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth/login");
  };

  const StatCard = ({ label, value, icon: Icon, trend, up, color }) => (
    <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all">
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

  const ExamRow = ({ exam, i }) => {
    const passed = exam.status === "passed";
    const scoreColor =
      exam.score >= 70
        ? "text-emerald-400"
        : exam.score >= 50
          ? "text-orange-400"
          : "text-red-400";
    return (
      <div
        className={`grid grid-cols-[2fr_1fr_70px_90px_60px] gap-3 items-center px-4 py-4 rounded-xl hover:bg-[#1e3a8a]/5 text-sm ${i < EXAMS.length - 1 ? "border-b border-slate-200" : ""}`}
      >
        <div className="font-medium text-[#1e3a8a]">{exam.name}</div>
        <div className="text-xs text-slate-500 hidden sm:block">
          {exam.date}
        </div>
        <div className={`font-bold text-base ${scoreColor}`}>{exam.score}%</div>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${passed ? "text-emerald-700 bg-emerald-100 border-emerald-300" : "text-red-700 bg-red-100 border-red-300"}`}
        >
          {passed ? <MdCheckCircle size={11} /> : <MdCancel size={11} />}
          {passed ? "Passed" : "Failed"}
        </span>
        <button className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
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
              AI
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-[#1e3a8a]">Ahmed Ihab</p>
              <p className="text-xs text-slate-500">Student</p>
            </div>
            <MdLogout
              size={16}
              className="text-slate-600 hover:text-orange-600"
            />
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
                <div className="px-4 py-3 border-t border-slate-200 bg-white text-center">
                  <button className="text-xs text-[#1e3a8a] hover:text-[#1e40af] font-semibold">
                    View all notifications
                  </button>
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
                AI
              </div>
              <span className="text-sm font-medium hidden sm:block">Ahmed</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-slate-200 bg-[#1e3a8a]/5">
                  <p className="text-sm font-semibold text-[#1e3a8a]">
                    Ahmed Ihab
                  </p>
                  <p className="text-xs text-slate-500">
                    student@edumetric.com
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

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2">
              Welcome back, Ahmed 👋
            </h1>
            <p className="text-slate-600">
              Here is your performance overview for this semester
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#1e3a8a] mb-2">
              Quick Actions
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Jump right into your workflow
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white hover:shadow-lg transition-all">
                <MdAddCircleOutline size={16} />
                Create New Exam
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white hover:shadow-lg transition-all">
                <MdAutoAwesome size={16} />
                Generate AI Questions
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1e3a8a]/10 border border-slate-300 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
                <MdMenuBook size={16} />
                View Question Bank
              </button>
            </div>
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
                <BarChart data={CHART_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(30,58,138,0.1)"
                  />
                  <XAxis dataKey="month" stroke="rgba(30,58,138,0.5)" />
                  <YAxis stroke="rgba(30,58,138,0.5)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,58,138,0.9)",
                      border: "1px solid rgba(30,58,138,0.2)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#1e3a8a" }}
                  />
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
                    data={DIFFICULTY}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {DIFFICULTY.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,58,138,0.9)",
                      border: "1px solid rgba(30,58,138,0.2)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#1e3a8a" }}
                  />
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
              <button className="text-xs px-4 py-2 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
                View all results
              </button>
            </div>
            <div className="grid grid-cols-[2fr_1fr_70px_90px_60px] gap-3 px-4 py-3 mb-2 border-b border-slate-200">
              {["Exam Name", "Date", "Score", "Status", "Action"].map(
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
            {EXAMS.map((exam, i) => (
              <ExamRow key={exam.name} exam={exam} i={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
