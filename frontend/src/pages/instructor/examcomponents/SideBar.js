import React from "react";
import {
  MdDashboard,
  MdCreate,
  MdLibraryBooks,
  MdBarChart,
  MdGroup,
  MdSettings,
  MdLogout,
  MdClose,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NAV = [
  { label: "Dashboard", path: "/dashboard", icon: MdDashboard },
  { label: "Create Exam", path: "/create-exam", icon: MdCreate },
  { label: "Question Bank", path: "/question-bank", icon: MdLibraryBooks },
  { label: "Analytics", path: "/analytics", icon: MdBarChart },
  { label: "Students", path: "/students", icon: MdGroup },
  { label: "Settings", path: "/settings", icon: MdSettings },
];

export default function Sidebar({ open, setOpen, user, onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      {/* overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 h-full w-60 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center font-bold">
            E
          </div>
          <span className="font-bold text-[#1e3a8a]">EduMetric</span>

          <button
            className="lg:hidden ml-auto"
            onClick={() => setOpen(false)}
          >
            <MdClose />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV.map(({ label, path, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                navigate(path);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-[#1e3a8a]/10 hover:text-[#1e3a8a] transition"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* USER / LOGOUT */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-xs">
              DR
            </div>
            <div>
              <p className="text-sm font-medium text-[#1e3a8a]">
                {user?.full_name || "Teacher"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            <MdLogout />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}