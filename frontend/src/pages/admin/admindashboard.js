import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
   MdDashboard, 
   MdPeople, 
   MdAssignment, 
   MdBarChart, 
   MdSearch, 
   MdTrendingUp, 
   MdTrendingDown, 
   MdMenu, 
   MdClose, 
   MdLogout, 
   MdCheckCircle, 
   MdCancel,  
   MdDeleteOutline 
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
  Legend 
} from "recharts";
import logo from "../../images/home/logo1.png";

// Add these back — these are UI constants not database data
const NAV = [
  { label: "Dashboard", icon: MdDashboard, active: true },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-300 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-slate-900">{payload[0].name}</p>
        <p className="text-sm text-slate-700">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  //  state variables dol badal el hard coded data 3shan n fetch el data mn el backend w n displayha
 const [stats, setStats] = useState(null);
 const [exams, setExams] = useState([]);
 const [userGrowth, setUserGrowth] = useState([]);
 const [userDistribution, setUserDistribution] = useState([]);

//m4 fahma el code da awy bs harga3lo tany hwa by3ml fetch mn el backend l data elly 3ndna fe el dashboard zay el stats cards w el tables w el charts w by7ot el data di fe state variables 3shan n displayha fe el UI
 useEffect(() => {

    // fetch stats cards data
    fetch("http://localhost:8000/api/admin/stats/", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(err => console.error("Stats error:", err));

    // fetch exams table data
    fetch("http://localhost:8000/api/admin/exams/", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => setExams(data))
    .catch(err => console.error("Exams error:", err));

    // fetch user growth chart data
    fetch("http://localhost:8000/api/admin/user-growth/", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => setUserGrowth(data))
    .catch(err => console.error("Growth error:", err));

    // fetch user distribution pie data
    fetch("http://localhost:8000/api/admin/user-distribution/", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => setUserDistribution(data))
    .catch(err => console.error("Distribution error:", err));

    // fetch students
fetch("http://localhost:8000/api/admin/students/", {
    credentials: "include"
})
.then(res => res.json())
.then(data => setStudents(data))
.catch(err => console.error("Students error:", err));

// fetch teachers
fetch("http://localhost:8000/api/admin/teachers/", {
    credentials: "include"
})
.then(res => res.json())
.then(data => setTeachers(data))
.catch(err => console.error("Teachers error:", err));

}, []); // [] means run once when page loads

const handleLogout = async () => {
    try {
        await fetch("http://localhost:8000/api/logout/", {
            method: "POST",
            credentials: "include",  // sends session cookie to Django
        });
    } catch (err) {
        console.error("Logout error:", err);
    }
    navigate("/");  // redirect to home page after logout which e7na lsa ma3mlanaha444

};
const handleDeleteUser = async (userId) => {
    // window.confirm is a built-in browser function that shows a confirmation popup
    if (!window.confirm("Are you sure you want to delete this account?")) return;

    try {
        await fetch("http://localhost:8000/api/admin/users/", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
        });

        // remove deleted user from state without refetching
        setStudents(prev => prev.filter(s => s.id !== userId));
        setTeachers(prev => prev.filter(t => t.id !== userId));
        // setUsers(prev => prev.filter(u => u.id !== userId));

    } catch (err) {
        console.error("Delete error:", err);
    }
};
  const StatCard = ({ label, value, icon: Icon, trend, up, color }) => (
    <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}><Icon size={24} /></div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${up ? "text-emerald-600 bg-emerald-100" : "text-orange-600 bg-orange-100"}`}>
          {up ? <MdTrendingUp className="inline mr-1" size={12} /> : <MdTrendingDown className="inline mr-1" size={12} />}
        </span>
      </div>
      <div className="text-3xl font-bold text-[#1e3a8a] mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-600 mb-2">{label}</div>
      <div className={`text-xs ${up ? "text-emerald-600" : "text-orange-600"}`}>{trend}</div>
    </div>
  );


  const ExamRow = ({ exam, i }) => {
    const active = exam.status === "active";
    return (
      <div className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 items-center px-4 py-4 rounded-xl hover:bg-[#1e3a8a]/5 text-sm ${i < exams.length - 1 ? "border-b border-slate-200" : ""}`}>
        <div className="font-medium text-[#1e3a8a]">{exam.name}</div>
        <div className="text-xs text-slate-500 hidden sm:block">{exam.teacher}</div>
        <div className="text-sm text-slate-600">{exam.students}</div>
        <div className="text-sm text-slate-600">{exam.questions}</div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${active ? "text-emerald-700 bg-emerald-100 border-emerald-300" : "text-gray-700 bg-gray-100 border-gray-300"}`}>
          {active ? <MdCheckCircle size={11} /> : <MdCancel size={11} />}{active ? "Active" : "Closed"}
        </span>
        
      </div>
    );
  };
const StudentRow = ({ student, i }) => (
    <div className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_80px_80px_60px] gap-3 items-center px-4 py-4 rounded-xl hover:bg-[#1e3a8a]/5 text-sm ${i < students.length - 1 ? "border-b border-slate-200" : ""}`}>
        <div className="font-medium text-[#1e3a8a]">{student.name}</div>
        <div className="text-xs text-slate-500">{student.email}</div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            student.type === "Institutional"
                ? "text-purple-700 bg-purple-100 border-purple-300"
                : "text-blue-700 bg-blue-100 border-blue-300"
        }`}>
            {student.type}
        </span>
        <div className="text-xs text-slate-500">{student.institution}</div>
        <div className="text-sm font-bold text-[#1e3a8a] text-center">{student.exams_taken}</div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            student.status === "active"
                ? "text-emerald-700 bg-emerald-100 border-emerald-300"
                : "text-red-700 bg-red-100 border-red-300"
        }`}>
            {student.status === "active" ? <MdCheckCircle size={11} /> : <MdCancel size={11} />}
            {student.status}
        </span>
        <button
            onClick={() => handleDeleteUser(student.id)}
            className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
        >
            <MdDeleteOutline size={12} />Delete
        </button>
    </div>
);

const TeacherRow = ({ teacher, i }) => (
    <div className={`grid grid-cols-[2fr_1.5fr_1.5fr_80px_80px_60px] gap-3 items-center px-4 py-4 rounded-xl hover:bg-[#1e3a8a]/5 text-sm ${i < teachers.length - 1 ? "border-b border-slate-200" : ""}`}>
        <div className="font-medium text-[#1e3a8a]">{teacher.name}</div>
        <div className="text-xs text-slate-500">{teacher.email}</div>
        <div className="text-xs text-slate-500">{teacher.institution}</div>
        <div className="text-sm font-bold text-[#1e3a8a] text-center">{teacher.exams_created}</div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            teacher.status === "active"
                ? "text-emerald-700 bg-emerald-100 border-emerald-300"
                : "text-red-700 bg-red-100 border-red-300"
        }`}>
            {teacher.status === "active" ? <MdCheckCircle size={11} /> : <MdCancel size={11} />}
            {teacher.status}
        </span>
        <button
            onClick={() => handleDeleteUser(teacher.id)}
            className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
        >
            <MdDeleteOutline size={12} />Delete
        </button>
    </div>
);

  return (
    <div className="min-h-screen bg-white flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:relative top-0 left-0 h-full w-56 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          
          <button
            onClick={() => navigate("/")}
            className="focus:outline-none"
          >
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
          {NAV.map(({ label, icon: Icon, active }) => (
            <button key={label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-[#1e3a8a] text-white shadow-lg" : "text-slate-600 hover:text-slate-900 hover:bg-[#1e3a8a]/10"}`}>
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1e3a8a]/5 border border-slate-200 hover:bg-[#1e3a8a]/10 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">AD</div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-[#1e3a8a]">Administrator</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <MdLogout size={16} className="text-slate-600 hover:text-red-600" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600"><MdMenu size={22} /></button>
          <div className="relative flex-1 max-w-xs">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search users..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-[#1e3a8a] placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a]/20 transition-all">
              <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">AD</div>
              <span className="text-sm font-medium hidden sm:block">Admin</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-slate-200 bg-[#1e3a8a]/5">
                  <p className="text-sm font-semibold text-[#1e3a8a]">Administrator</p>
                  <p className="text-xs text-slate-500">admin@edumetric.com</p>
                </div>
                <div className="border-t border-slate-200 py-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all">
                    <MdLogout size={16} />Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2">Welcome, Administrator 👋</h1>
            <p className="text-slate-600">System overview and management</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Fixed — uses real data from backend code tany m4 fahmahh harga3lo */}
    {stats && (
    <>
        <StatCard
            label="Total Users"
            value={stats.total_users}
            icon={MdPeople}
            trend=""
            up={true}
            color="from-[#1e40af] to-[#1e3a8a]"
        />
        <StatCard
            label="Total Exams"
            value={stats.total_exams}
            icon={MdAssignment}
            trend=""
            up={true}
            color="from-[#1e40af] to-[#1e3a8a]"
        />
        <StatCard
            label="Active Exams"
            value={stats.active_exams}
            icon={MdCheckCircle}
            trend=""
            up={true}
            color="from-[#1e40af] to-[#1e3a8a]"
        />
        <StatCard
            label="System Health"
            value={stats.system_health}
            icon={MdBarChart}
            trend="All systems operational"
            up={true}
            color="from-[#1e40af] to-[#1e3a8a]"
        />
    </>
)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">User Growth</h2>
              <p className="text-sm text-slate-500 mb-6">Monthly user registration trend</p>
              <ResponsiveContainer width="100%" height={220}>

                 {/* Fixed — uses real data da el charts */}
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,138,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(30,58,138,0.5)" />
                  <YAxis stroke="rgba(30,58,138,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                </BarChart>
                
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">User Distribution</h2>
              <p className="text-sm text-slate-500 mb-6">Breakdown by role</p>
              <ResponsiveContainer width="100%" height={220}>

                {/* //hana bardo edit 34an nest3ml el data el bgd */}
                <PieChart>
                  <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {userDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#1e3a8a", paddingTop: "16px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">Exams</h2>
                <p className="text-sm text-slate-500">Monitor all system exams</p>
              </div>
            </div>
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3 mb-2 border-b border-slate-200">
              {["Exam Name", "Teacher", "Students", "Questions", "Status"].map((h) => <span key={h} className={`text-xs font-semibold uppercase text-slate-500 `}>{h}</span>)}
            </div>
            {exams.map((exam, i) => <ExamRow key={i} exam={exam} i={i} />)}
          </div>
                     {/* Students Table */}
          <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">Students</h2>
                      <p className="text-sm text-slate-500">
                          All students — {students.filter(s => s.type === "Free").length} free · {students.filter(s => s.type === "Institutional").length} institutional
                      </p>
                  </div>
              </div>
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_80px_80px_60px] gap-3 px-4 py-3 mb-2 border-b border-slate-200">
                  {["Name", "Email", "Type", "Institution", "Exams", "Status", "Action"].map(h => (
                      <span key={h} className="text-xs font-semibold uppercase text-slate-500">{h}</span>
                  ))}
              </div>
              {students.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">No students yet</p>
              ) : (
                  students.map((student, i) => <StudentRow key={student.id} student={student} i={i} />)
              )}
          </div>

          {/* Teachers Table */}
          <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/2 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h2 className="text-lg font-bold text-[#1e3a8a] mb-1">Teachers</h2>
                      <p className="text-sm text-slate-500">
                          All teachers — {teachers.length} total
                      </p>
                  </div>
              </div>
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_80px_80px_60px] gap-3 px-4 py-3 mb-2 border-b border-slate-200">
                  {["Name", "Email", "Institution", "Exams Made", "Status", "Action"].map(h => (
                      <span key={h} className="text-xs font-semibold uppercase text-slate-500">{h}</span>
                  ))}
              </div>
              {teachers.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">No teachers yet</p>
              ) : (
                  teachers.map((teacher, i) => <TeacherRow key={teacher.id} teacher={teacher} i={i} />)
              )}
          </div>
        </main>
      </div>
    </div>
  );
}