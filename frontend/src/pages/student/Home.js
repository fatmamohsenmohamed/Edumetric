import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAutoAwesome,
  MdBarChart,
  MdSecurity,
  MdPlayArrow,
  MdLogout,
  MdWorkspacePremium,
  MdTimer,
  MdAssignment,
  MdMenuBook,
  MdSearch,
  MdFilterList,
  MdPersonAdd,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdArrowOutward,
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
import logoImg from "../../images/home/logo1.png";


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
      <HomeHeader user={user} onLogout={handleLogout} navigate={navigate} />
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
      <FooterSection navigate={navigate} />
    </div>
  );
}

function HomeHeader({ user, onLogout, navigate }) {
  const [activeSection, setActiveSection] = useState("features");
  const [scrolled, setScrolled] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Exams", href: "exams" },
      { label: "Features", href: "features" },
      { label: "How it works", href: "how-it-works" },
    ],
    []
  );

  // scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 20);

      let current = "features";

      navItems.forEach((item) => {
        const section = document.getElementById(item.href);
        if (section) {
          const top = section.offsetTop - 120;
          const bottom = top + section.offsetHeight;

          if (scrollY >= top && scrollY < bottom) {
            current = item.href;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <header
      className={`
        fixed top-0 w-full z-30 transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-md py-2"
            : "bg-white/60 backdrop-blur-md py-4"
        }
        border-b border-slate-200
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300">

        {/* LOGO */}
        <div className="flex items-center justify-center gap-3 h-18 w-40">
          <img
            src={logoImg}
            alt="EduMetric Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-1 relative">

          {navItems.map((item) => {
            const isActive = activeSection === item.href;

            return (
              <button
                key={item.href}
                onClick={() =>
                  document
                    .getElementById(item.href)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className={`
                  relative px-4 py-2 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "text-blue-900 font-semibold"
                      : "text-slate-600 hover:text-blue-900"
                  }
                `}
              >
                {item.label}

                {/* sliding underline */}
                <span
                  className={`
                    absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px]
                    bg-blue-900 rounded-full transition-all duration-300
                    ${isActive ? "w-4/5 opacity-100" : "w-0 opacity-0"}
                  `}
                />

                {/* glow effect */}
                {isActive && (
                  <span className="absolute inset-0 bg-blue-100/40 blur-xl rounded-xl -z-10" />
                )}
              </button>
            );
          })}

          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 text-slate-600 hover:text-blue-900 rounded-xl"
          >
            Pricing
          </button>
        </nav>

        {/* USER */}
        {user ? (
          <UserMenu user={user} onLogout={onLogout} />
        ) : (
          <GuestMenu navigate={navigate} />
        )}
      </div>
    </header>
  );
}

function UserMenu({ user, onLogout }) {
  const initial = user.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      <div className="px-3 py-1.5 rounded-full bg-blue-50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">
          {initial}
        </div>
        <span className="text-sm text-blue-900">{user.full_name}</span>
      </div>

      <button
        onClick={onLogout}
        className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600"
      >
        <MdLogout size={18} />
      </button>
    </div>
  );
}

function GuestMenu({ navigate }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-xl"
      >
        Login
      </button>
      <button
        onClick={() => navigate("/register")}
        className="px-4 py-2 bg-blue-900 text-white rounded-xl"
      >
        Sign Up
      </button>
    </div>
  );
}

function HeroSection({ user, navigate }) {
  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/10 blur-3xl rounded-full top-10 left-10" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full bottom-0 right-0" />

      <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10">

        {/* LEFT SIDE - MESSAGE */}
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

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#exams"
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:scale-105 transition"
            >
              Browse Exams
            </a>

            <button
              onClick={() =>
                user ? navigate("#exams") : navigate("/register")
              }
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

        {/* RIGHT SIDE - IMAGE ONLY */}
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
function ExamsSection({
  loading,
  exams,
  freeExams,
  paidExams,
  onExamClick,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | free | paid

  // 🔎 filtering logic
  const filteredExams = exams.filter((exam) => {
    const matchSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.subject.toLowerCase().includes(search.toLowerCase()) ||
      exam.instructor.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "free"
        ? !exam.is_paid
        : exam.is_paid;

    return matchSearch && matchFilter;
  });

  const displayFree = filteredExams.filter((e) => !e.is_paid);
  const displayPaid = filteredExams.filter((e) => e.is_paid);

  return (
    <section id="exams" className="max-w-7xl mx-auto px-6 py-20">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
          Available Exams
        </h2>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
          Practice for free or upgrade to certified exams to validate your skills.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">

        {/* SEARCH */}
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

        {/* FILTER */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          <MdFilterList className="text-slate-500 ml-2" />

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-900 text-white"
                : "text-slate-600"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("free")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "free"
                ? "bg-emerald-500 text-white"
                : "text-slate-600"
            }`}
          >
            Free
          </button>

          <button
            onClick={() => setFilter("paid")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === "paid"
                ? "bg-amber-500 text-white"
                : "text-slate-600"
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-slate-500 animate-pulse">
          Loading exams...
        </div>
      )}

      {/* EMPTY STATES */}
    {!loading && exams.length === 0 && (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">

        <img
          src={noDataImg}
          alt="No exams"
          className="w-44 mx-auto mb-6 opacity-90"
        />

        <h3 className="text-xl font-bold text-blue-900 mb-2">
          No exams yet
        </h3>

        <p className="text-slate-600">
          There are no exams available in the system right now.
        </p>
      </div>
    )}

    {!loading && exams.length > 0 && filteredExams.length === 0 && (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">

        <img
          src={emptyImg}
          alt="No results"
          className="w-44 mx-auto mb-6 opacity-90"
        />

        <h3 className="text-xl font-bold text-blue-900 mb-2">
          No results found
        </h3>

        <p className="text-slate-600 mb-6">
          Try changing your search or filter to find what you're looking for.
        </p>

        <button
          onClick={() => {
            setSearch("");
            setFilter("all");
          }}
          className="px-6 py-3 bg-blue-900 text-white rounded-2xl hover:scale-105 transition"
        >
          Reset Filters
        </button>
      </div>
    )}

      {/* FREE */}
      {!loading && displayFree.length > 0 && (
        <ExamGroup
          title="Free Practice"
          icon={MdMenuBook}
          iconColor="text-blue-900"
          exams={displayFree}
          onExamClick={onExamClick}
        />
      )}

      {/* PAID */}
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

/* ===================== GROUP ===================== */

function ExamGroup({ title, icon: Icon, iconColor, exams, onExamClick }) {
  return (
    <div className="mb-16">

      <div className="flex items-center gap-2 mb-6">
        <Icon className={iconColor} size={22} />
        <h3 className="text-xl md:text-2xl font-bold text-blue-900">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onClick={onExamClick} />
        ))}
      </div>

    </div>
  );
}

/* ===================== CARD ===================== */

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

      {/* TITLE */}
      <div className="mb-4">
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition">
          {exam?.title}
        </h4>

        <p className="text-sm text-slate-500 mt-1">
          {exam?.subject} • {exam?.instructor}
        </p>
      </div>

      {/* META */}
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

      {/* BADGE */}
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

      {/* CTA */}
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
        {isPaid ? (
          <MdWorkspacePremium size={18} />
        ) : (
          <MdPlayArrow size={18} />
        )}

        {isPaid ? "Subscribe & Take" : "Start Free"}
      </button>

    </div>
  );
}

/* ===================== FEATURES SECTION ===================== */

function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-slate-50 py-24 overflow-hidden"
    >

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/30 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16">

          <span className="
            inline-block px-4 py-2 rounded-full
            bg-blue-100 text-blue-900
            text-sm font-semibold mb-4
          ">
            Powerful Features
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
            Why Choose EduMetric?
          </h2>

          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
            Everything you need to learn, practice,
            analyze your progress, and prove your skills professionally.
          </p>
        </div>

        {/* FEATURES GRID */}
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

/* ===================== FEATURE CARD ===================== */

function FeatureCard({ icon: Icon, title, description, image }) {
  return (
    <div
      className="
        group relative overflow-hidden
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        rounded-3xl p-7
        shadow-sm
        hover:shadow-2xl hover:-translate-y-3
        transition-all duration-300
      "
    >

      {/* TOP GRADIENT LINE */}
      <div className="
        absolute top-0 left-0 w-full h-1
        bg-gradient-to-r from-blue-900 via-indigo-600 to-blue-400
      " />

      {/* HOVER GLOW */}
      <div className="
        absolute inset-0 opacity-0
        group-hover:opacity-100
        transition duration-500
        bg-gradient-to-br from-blue-50/40 to-indigo-50/20
      " />

      {/* IMAGE */}
      <div className="relative z-10 flex justify-center">
        <img
          src={image}
          alt={title}
          className="
            w-28 h-28 object-contain mb-6
            group-hover:scale-110
            transition duration-300
          "
        />
      </div>

      {/* ICON */}
      <div
        className="
          relative z-10
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-blue-900 to-indigo-700
          text-white
          flex items-center justify-center
          mx-auto mb-5
          shadow-lg
        "
      >
        <Icon size={24} />
      </div>

      {/* TITLE */}
      <h4 className="
        relative z-10
        font-bold text-xl text-blue-900
        text-center mb-3
      ">
        {title}
      </h4>

      {/* DESCRIPTION */}
      <p className="
        relative z-10
        text-sm text-slate-600
        text-center leading-relaxed
      ">
        {description}
      </p>

      {/* DECORATIVE CIRCLE */}
      <div className="
        absolute -bottom-10 -right-10
        w-32 h-32 rounded-full
        bg-blue-100/40
        blur-2xl
      " />
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative bg-white py-24 overflow-hidden"
    >
      {/* background glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold mb-4">
            SIMPLE PROCESS
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
            How It Works
          </h2>

          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
            Start learning and earning certificates in just a few easy steps.
          </p>
        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          {/* connecting line */}
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

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  image,
}) {
  return (
    <div
      className="
        relative z-10 group
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        rounded-3xl
        p-8
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all duration-300
        overflow-hidden
      "
    >

      {/* BIG NUMBER */}
      <div className="absolute top-4 right-5 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition">
        {number}
      </div>

      {/* IMAGE */}
      <div className="mb-6 flex justify-center">
        <img
          src={image}
          alt={title}
          className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* ICON */}
      <div
        className="
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-blue-900 to-indigo-900
          text-white
          flex items-center justify-center
          shadow-lg
          mb-5
        "
      >
        <Icon size={28} />
      </div>

      {/* TITLE */}
      <h4 className="text-xl font-bold text-blue-900 mb-3">
        {title}
      </h4>

      {/* DESCRIPTION */}
      <p className="text-slate-600 leading-relaxed text-sm">
        {description}
      </p>

    </div>
  );
}

function FooterSection({ navigate }) {
  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden">

      {/* background glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

      <div className="relative z-10">

        {/* TOP */}
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">

          {/* BRAND */}
          <div className="lg:w-2/5">
            <FooterBrand navigate={navigate} />
          </div>

          {/* LINKS */}
          <div className="lg:w-3/5 grid grid-cols-3 gap-10 items-start mt-20">
            <FooterColumn
              title="Product"
              links={[
                { label: "Exams", href: "#exams" },
                { label: "Pricing", onClick: () => navigate("/pricing") },
                { label: "Features", href: "#features" },
              ]}
            />

            <FooterColumn
              title="Company"
              links={[
                { label: "About", onClick: () => navigate("/about") },
                { label: "Contact", onClick: () => navigate("/contact") },
              ]}
            />

            <FooterColumn
              title="Legal"
              links={[
                { label: "Terms", onClick: () => navigate("/terms") },
                { label: "Privacy", onClick: () => navigate("/privacy") },
              ]}
            />
        </div>
      </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-slate-400 text-center md:text-left">
              © 2026 EduMetric. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-slate-400 text-sm">
              <span className="hover:text-white transition cursor-pointer">
                Terms
              </span>

              <span className="hover:text-white transition cursor-pointer">
                Privacy
              </span>

              <span className="hover:text-white transition cursor-pointer">
                Support
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

function FooterBrand({ navigate }) {
  return (
    <div>

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-5">
        <img
          src={logoImg}
          alt="EduMetric Logo"
          className="w-auto h-20 object-contain p-1 rounded-lg"
        />
      </div>

      {/* DESCRIPTION */}
      <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
        Modern AI-powered examination platform helping students
        practice smarter, improve performance, and earn verified
        certificates.
      </p>

      {/* CONTACT */}
      <div className="space-y-3 text-sm text-slate-300">

        <div className="flex items-center gap-3">
          <MdEmail className="text-blue-400" size={18} />
          edumetric.plattform2026@gmail.com
        </div>

        <div className="flex items-center gap-3">
          <MdPhone className="text-blue-400" size={18} />
          +20 123 456 789
        </div>

        <div className="flex items-center gap-3">
          <MdLocationOn className="text-blue-400" size={18} />
          Cairo, Egypt
        </div>

      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/pricing")}
        className="
          mt-7 px-5 py-3 rounded-2xl
          bg-white text-blue-900 font-semibold
          flex items-center gap-2
          hover:scale-105 transition
        "
      >
        Explore Premium
        <MdArrowOutward size={18} />
      </button>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-lg mb-5 text-white">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            {link.href ? (
              <a
                href={link.href}
                className="
                  text-slate-400 hover:text-white
                  transition-all duration-300
                  hover:translate-x-1 inline-block
                "
              >
                {link.label}
              </a>
            ) : (
              <button
                onClick={link.onClick}
                className="
                  text-slate-400 hover:text-white
                  transition-all duration-300
                  hover:translate-x-1
                "
              >
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}