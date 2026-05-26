import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdClose,
  MdLogout,
  MdPlayArrow,
  MdHistory,
} from "react-icons/md";
import logo from "../../images/home/logo1.png";

const NAV = [
  { label: "Dashboard", icon: MdDashboard, path: "/dashboard", active: true },
  { label: "Available Exams", icon: MdPlayArrow, path: "/testexam" },
  { label: "My Results", icon: MdHistory, path: "/my-results" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed lg:relative top-0 left-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="focus:outline-none">
          <img
            src={logo}
            alt="EduMetric Logo"
            className="h-20 w-40 object-contain"
          />
        </button>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-600"
        >
          <MdClose size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV.map(({ label, icon: Icon, active, path }) => (
          <button
            key={label}
            onClick={() => path && navigate(path)}
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
            {user?.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "S"}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-[#1e3a8a]">
              {user?.full_name || "Student"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.full_name || "Student"}
            </p>
          </div>
          <MdLogout size={16} className="text-slate-600" />
        </button>
      </div>
    </aside>
  );
}