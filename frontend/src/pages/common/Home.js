import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAutoAwesome,
  MdBarChart,
  MdSecurity,
  MdPlayArrow,
  MdWorkspacePremium,
  MdTimer,
  MdAssignment,
  MdMenuBook,
  MdSearch,
  MdFilterList,
  MdPersonAdd,
} from "react-icons/md";
import { motion } from "framer-motion";
import heroImg from "../../images/home/heroimg.svg";
import noDataImg from "../../images/home/nodata.svg";
import emptyImg from "../../images/home/empty.svg";
import aiImg from "../../images/home/ai.svg";
import analyticsImg from "../../images/home/analytics.svg";
import certificateImg from "../../images/home/certificate.svg";
import securityImg from "../../images/home/security.svg";
import signupImg from "../../images/home/signup.svg";
import examImg from "../../images/home/exam.svg";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/me/", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));

    fetch("http://localhost:8000/api/available/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setExams(data.exams || []))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const stored = sessionStorage.getItem("scrollTo");
    const target = stored || hash;

    if (target) {
      sessionStorage.removeItem("scrollTo");
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  function handleLogout() {
    fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    }).finally(() => navigate("/login"));
  }

  function handleExamClick(exam) {
    if (exam.is_paid && !exam.is_purchased) {
      navigate("/pricing", {
        state: { examId: exam.id, examTitle: exam.title },
      });
    } else {
      navigate("/takeexam/" + exam.id);
    }
  }

  const freeExams = exams.filter((e) => !e.is_paid);
  const paidExams = exams.filter((e) => e.is_paid);

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} onLogout={handleLogout} activePage="home" />
      <HeroSection user={user} navigate={navigate} />
      <ExamsSection
        loading={loading}
        exams={exams}
        freeExams={freeExams}
        paidExams={paidExams}
        onExamClick={handleExamClick}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer activePage="home"/>
    </div>
  );
}

/* ===================== HERO SECTION ===================== */

function HeroSection({ user, navigate }) {
  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden">

      <div className="absolute w-[600px] h-[600px] bg-blue-500/10 blur-3xl rounded-full top-10 left-10" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full bottom-0 right-0" />

      <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {user && (
            <p className="text-blue-300 mb-4 text-sm">
              Welcome back, {user.full_name}
            </p>
          )}

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Master your exams
            <br />
            <span className="text-blue-300">with confidence</span>
          </h1>

          <p className="text-blue-100 text-lg max-w-xl mb-8 leading-relaxed">
            Practice smarter with AI-powered exams. Track your progress, improve your skills,
            and earn verified certificates that actually matter.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#exams"
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:scale-105 transition"
            >
              Browse Exams
            </a>

            <button
              onClick={() => user ? navigate("#exams") : navigate("/register")}
              className="
                px-6 py-3
                border border-white/30
                text-white font-semibold
                rounded-xl
                hover:bg-white/10
                hover:scale-105
                transition-all duration-300
              "
            >
              Get Started
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <motion.img
            src={heroImg}
            alt="hero"
            className="w-full max-w-md drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </motion.div>

      </div>
    </section>
  );
}

/* ===================== EXAMS SECTION ===================== */

function ExamsSection({ loading, exams, freeExams, paidExams, onExamClick }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredExams = exams.filter((exam) => {
    const matchSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.subject.toLowerCase().includes(search.toLowerCase()) ||
      exam.instructor.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : filter === "free" ? !exam.is_paid : exam.is_paid;

    return matchSearch && matchFilter;
  });

  const displayFree = filteredExams.filter((e) => !e.is_paid);
  const displayPaid = filteredExams.filter((e) => e.is_paid);

  return (
    <section id="exams" className="max-w-7xl mx-auto px-6 py-20">

      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
          Available Exams
        </h2>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
          Practice for free or upgrade to certified exams to validate your skills.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">

        <div className="relative w-full md:w-1/2">
          <MdSearch className="absolute top-3.5 left-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search exams by title, subject, instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-3 rounded-2xl
              border border-slate-200
              focus:outline-none focus:ring-2 focus:ring-blue-900
              bg-white shadow-sm
            "
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          <MdFilterList className="text-slate-500 ml-2" />

          {[
            { value: "all", label: "All", activeClass: "bg-blue-900 text-white" },
            { value: "free", label: "Free", activeClass: "bg-emerald-500 text-white" },
            { value: "paid", label: "Paid", activeClass: "bg-amber-500 text-white" },
          ].map(({ value, label, activeClass }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === value ? activeClass : "text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center text-slate-500 animate-pulse">Loading exams...</div>
      )}

      {!loading && exams.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <img src={noDataImg} alt="No exams" className="w-44 mx-auto mb-6 opacity-90" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">No exams yet</h3>
          <p className="text-slate-600">There are no exams available in the system right now.</p>
        </div>
      )}

      {!loading && exams.length > 0 && filteredExams.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <img src={emptyImg} alt="No results" className="w-44 mx-auto mb-6 opacity-90" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">No results found</h3>
          <p className="text-slate-600 mb-6">
            Try changing your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => { setSearch(""); setFilter("all"); }}
            className="px-6 py-3 bg-blue-900 text-white rounded-2xl hover:scale-105 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {!loading && displayFree.length > 0 && (
        <ExamGroup
          title="Free Practice"
          icon={MdMenuBook}
          iconColor="text-blue-900"
          exams={displayFree}
          onExamClick={onExamClick}
        />
      )}

      {!loading && displayPaid.length > 0 && (
        <ExamGroup
          title="Certified Exams"
          icon={MdWorkspacePremium}
          iconColor="text-amber-500"
          exams={displayPaid}
          onExamClick={onExamClick}
        />
      )}
    </section>
  );
}

/* ===================== EXAM GROUP ===================== */

function ExamGroup({ title, icon: Icon, iconColor, exams, onExamClick }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Icon className={iconColor} size={22} />
        <h3 className="text-xl md:text-2xl font-bold text-blue-900">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onClick={onExamClick} />
        ))}
      </div>
    </div>
  );
}

/* ===================== EXAM CARD ===================== */

function ExamCard({ exam, onClick }) {
  const isPaid = exam.is_paid;

  return (
    <div className="
      group flex flex-col p-6 rounded-3xl
      bg-white/70 backdrop-blur-xl
      border border-slate-200
      shadow-sm
      hover:shadow-2xl hover:-translate-y-3 scale-[1.01]
      transition-all duration-300
    ">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition">
          {exam?.title}
        </h4>
        <p className="text-sm text-slate-500 mt-1">
          {exam?.subject} • {exam?.instructor}
        </p>
      </div>

      <div className="flex gap-3 mb-5 text-xs">
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          <MdTimer size={14} />
          {exam.duration} min
        </span>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          <MdAssignment size={14} />
          {exam.question_count} Q
        </span>
      </div>

      <div className="mb-5">
        <span className={`
          text-xs px-3 py-1 rounded-full font-semibold
          ${isPaid
            ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700"
            : "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700"}
        `}>
          {isPaid ? "CERTIFIED EXAM" : "FREE PRACTICE"}
        </span>
      </div>

      <button
        onClick={() => onClick(exam)}
        className={`
          mt-auto w-full py-3 rounded-2xl font-semibold
          transition-all duration-300
          flex items-center justify-center gap-2
          ${isPaid
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            : "bg-gradient-to-r from-blue-900 to-indigo-900 text-white"}
          hover:scale-[1.03] hover:shadow-lg
        `}
      >
        {isPaid ? <MdWorkspacePremium size={18} /> : <MdPlayArrow size={18} />}
        {isPaid ? "Subscribe & Take" : "Start Free"}
      </button>
    </div>
  );
}

/* ===================== FEATURES SECTION ===================== */

function FeaturesSection() {
  return (
    <section id="features" className="relative bg-slate-50 py-24 overflow-hidden">

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/30 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold mb-4">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
            Why Choose EduMetric?
          </h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
            Everything you need to learn, practice, analyze your progress, and prove your skills professionally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            image={aiImg}
            icon={MdAutoAwesome}
            title="AI-Powered Questions"
            description="Smart AI-generated questions that adapt to your curriculum and learning goals."
          />
          <FeatureCard
            image={analyticsImg}
            icon={MdBarChart}
            title="Performance Analytics"
            description="Track scores, accuracy, strengths, and weaknesses with detailed reports."
          />
          <FeatureCard
            image={certificateImg}
            icon={MdWorkspacePremium}
            title="Verified Certificates"
            description="Earn professional certificates after completing certified paid exams."
          />
          <FeatureCard
            image={securityImg}
            icon={MdSecurity}
            title="Secure & Reliable"
            description="Your exams, progress, and personal data stay protected and encrypted."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, image }) {
  return (
    <div className="
      group relative overflow-hidden
      bg-white/80 backdrop-blur-xl
      border border-slate-200
      rounded-3xl p-7
      shadow-sm
      hover:shadow-2xl hover:-translate-y-3
      transition-all duration-300
    ">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-indigo-600 to-blue-400" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-50/40 to-indigo-50/20" />

      <div className="relative z-10 flex justify-center">
        <img
          src={image}
          alt={title}
          className="w-28 h-28 object-contain mb-6 group-hover:scale-110 transition duration-300"
        />
      </div>

      <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-700 text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
        <Icon size={24} />
      </div>

      <h4 className="relative z-10 font-bold text-xl text-blue-900 text-center mb-3">{title}</h4>
      <p className="relative z-10 text-sm text-slate-600 text-center leading-relaxed">{description}</p>

      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-100/40 blur-2xl" />
    </div>
  );
}

/* ===================== HOW IT WORKS ===================== */

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-white py-24 overflow-hidden">

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold mb-4">
            SIMPLE PROCESS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900">How It Works</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
            Start learning and earning certificates in just a few easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 z-0" />

          <StepCard
            number="01"
            icon={MdPersonAdd}
            title="Create Account"
            description="Sign up for free and access hundreds of practice exams instantly."
            image={signupImg}
          />
          <StepCard
            number="02"
            icon={MdMenuBook}
            title="Choose an Exam"
            description="Select free practice exams or premium certified assessments."
            image={examImg}
          />
          <StepCard
            number="03"
            icon={MdWorkspacePremium}
            title="Earn Certificate"
            description="Pass your exam and receive a verified certificate you can share."
            image={certificateImg}
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, icon: Icon, title, description, image }) {
  return (
    <div className="
      relative z-10 group
      bg-white/80 backdrop-blur-xl
      border border-slate-200
      rounded-3xl p-8
      shadow-sm
      hover:shadow-2xl hover:-translate-y-2
      transition-all duration-300
      overflow-hidden
    ">
      <div className="absolute top-4 right-5 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition">
        {number}
      </div>

      <div className="mb-6 flex justify-center">
        <img
          src={image}
          alt={title}
          className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center shadow-lg mb-5">
        <Icon size={28} />
      </div>

      <h4 className="text-xl font-bold text-blue-900 mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}