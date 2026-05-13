import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdCreate,
  MdLibraryBooks,
  MdBarChart,
  MdSettings,
  MdClose,
  MdLogout,
  MdAssignment,
} from "react-icons/md";

import logo from "../../images/home/logo1.png";

const NAV = [
  { label: "Dashboard", icon: MdDashboard },
  { label: "Create Exam", icon: MdCreate },
  { label: "Question Bank", icon: MdLibraryBooks },
  { label: "Exams", icon: MdAssignment },
  { label: "Results", icon: MdBarChart },
  { label: "Settings", icon: MdSettings },
];

/**
 * InstructorSidebar
 *
 * Props:
 *  - isOpen   {boolean}  — controls mobile visibility
 *  - onClose  {function} — called when the ✕ button or backdrop is clicked
 *  - user     {object}   — { full_name, email } from /api/me/
 *  - onLogout {function} — logout handler
 */
export default function InstructorSidebar({ isOpen, onClose, user, onLogout }) {
  const navigate = useNavigate();

  const handleNavClick = (label) => {
    if (label === "Dashboard") navigate("/instructordashboard");
    if (label === "Create Exam") navigate("/createexam");
    if (label === "Question Bank") navigate("/questionbank");
    if (label === "Exams") navigate("/examsmanagement");
    if (label === "Results") navigate("/results");
    // if (label === "Settings") navigate("/settings");
    onClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="focus:outline-none"
          >
            <img
              src={logo}
              alt="EduMetric Logo"
              className="h-20 w-40 object-contain"
            />
          </button>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-600"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => handleNavClick(label)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-[#1e3a8a]/10"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="px-4 py-6 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1e3a8a]/5 border border-slate-200 hover:bg-[#1e3a8a]/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
              DR
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-[#1e3a8a]">
                {user?.full_name || "Teacher"}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user?.email || ""}
              </p>
            </div>

            <MdLogout size={16} className="text-slate-600" />
          </button>
        </div>
      </aside>
    </>
  );
}