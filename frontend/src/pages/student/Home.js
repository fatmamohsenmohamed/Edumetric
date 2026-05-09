import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSchool,
  MdAutoAwesome,
  MdBarChart,
  MdSecurity,
  MdPlayArrow,
  MdLogout,
  MdWorkspacePremium,
  MdRocketLaunch,
  MdTimer,
  MdAssignment,
  MdLogin,
  MdMenuBook,
} from "react-icons/md";

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
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
            E
          </div>
          <span className="font-bold text-xl text-blue-900">EduMetric</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-blue-900 font-medium">
            Features
          </a>
          <a href="#exams" className="text-slate-600 hover:text-blue-900 font-medium">
            Exams
          </a>
          <a href="#how-it-works" className="text-slate-600 hover:text-blue-900 font-medium">
            How It Works
          </a>
          <button
            onClick={() => navigate("/pricing")}
            className="text-slate-600 hover:text-blue-900 font-medium"
          >
            Pricing
          </button>
        </nav>

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
  const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50">
        <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
          {initial}
        </div>
        <span className="text-sm font-medium text-blue-900">{user.full_name}</span>
      </div>
      <button
        onClick={onLogout}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"
        title="Logout"
      >
        <MdLogout size={20} />
      </button>
    </div>
  );
}

function GuestMenu({ navigate }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-1 px-4 py-2 text-blue-900 font-medium hover:bg-blue-50 rounded-xl"
      >
        <MdLogin size={18} />
        Login
      </button>
      <button
        onClick={() => navigate("/register")}
        className="px-4 py-2 bg-blue-900 text-white font-medium rounded-xl hover:bg-blue-800"
      >
        Sign Up
      </button>
    </div>
  );
}

function HeroSection({ user, navigate }) {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          {user ? (
            <p className="text-blue-200 mb-3">Welcome back, {user.full_name}</p>
          ) : null}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Master your subject.
            <br />
            <span className="text-blue-200">Earn certified knowledge.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
            Take free practice exams or unlock certified assessments to prove
            your skills. Powered by AI, designed for real learners.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#exams"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <MdRocketLaunch size={20} />
              Browse Exams
            </a>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              <MdWorkspacePremium size={20} />
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExamsSection({ loading, exams, freeExams, paidExams, onExamClick }) {
  return (
    <section id="exams" className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
          Available Exams
        </h2>
        <p className="text-slate-600 mt-2">
          Start practicing for free, or earn a certificate with our paid exams.
        </p>
      </div>

      {loading ? <p className="text-slate-500">Loading exams...</p> : null}

      {!loading && exams.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
          <MdSchool size={48} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No exams available yet.</p>
        </div>
      ) : null}

      {!loading && freeExams.length > 0 ? (
        <ExamGroup
          title="Free Practice"
          icon={MdMenuBook}
          iconColor="text-blue-900"
          exams={freeExams}
          onExamClick={onExamClick}
        />
      ) : null}

      {!loading && paidExams.length > 0 ? (
        <ExamGroup
          title="Certified Exams"
          icon={MdWorkspacePremium}
          iconColor="text-amber-500"
          exams={paidExams}
          onExamClick={onExamClick}
        />
      ) : null}
    </section>
  );
}

function ExamGroup({ title, icon: Icon, iconColor, exams, onExamClick }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
        <Icon size={22} className={iconColor} />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onClick={onExamClick} />
        ))}
      </div>
    </div>
  );
}

function ExamCard({ exam, onClick }) {
  const isPaid = exam.is_paid;
  const buttonClass = isPaid
    ? "mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all bg-amber-500 text-white hover:bg-amber-600"
    : "mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all bg-blue-900 text-white hover:bg-blue-800";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-2">
          <h4 className="font-bold text-lg text-blue-900">{exam.title}</h4>
          <p className="text-xs text-slate-500 mt-1">
            {exam.subject} - by {exam.instructor}
          </p>
        </div>
        {isPaid ? (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">
            <MdWorkspacePremium size={12} />${exam.price}
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
            FREE
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 my-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <MdTimer size={14} className="text-blue-900" />
          {exam.duration} min
        </div>
        <div className="flex items-center gap-1">
          <MdAssignment size={14} className="text-blue-900" />
          {exam.question_count} Q
        </div>
      </div>

      {isPaid ? (
        <p className="text-xs text-amber-700 mb-3 flex items-center gap-1">
          <MdWorkspacePremium size={12} />
          Earn a verified certificate on pass
        </p>
      ) : null}

      <button onClick={() => onClick(exam)} className={buttonClass}>
        {isPaid ? <MdWorkspacePremium size={16} /> : <MdPlayArrow size={16} />}
        {isPaid ? "Subscribe & Take" : "Start Free"}
      </button>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
            Why Choose EduMetric?
          </h2>
          <p className="text-slate-600 mt-2">
            Everything you need to learn, practice, and prove your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={MdAutoAwesome}
            title="AI-Powered Questions"
            description="Smart question generation that adapts to your curriculum."
          />
          <FeatureCard
            icon={MdBarChart}
            title="Performance Analytics"
            description="Track your progress with detailed visual reports."
          />
          <FeatureCard
            icon={MdWorkspacePremium}
            title="Verified Certificates"
            description="Earn shareable certificates for paid exams."
          />
          <FeatureCard
            icon={MdSecurity}
            title="Secure & Reliable"
            description="Your data is private, encrypted, and protected."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mb-4">
        <Icon size={24} />
      </div>
      <h4 className="font-bold text-lg text-blue-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
          How It Works
        </h2>
        <p className="text-slate-600 mt-2">Get started in three simple steps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StepCard
          number="1"
          title="Sign Up"
          description="Create a free account in seconds - no credit card required."
        />
        <StepCard
          number="2"
          title="Choose an Exam"
          description="Pick from free practice exams or paid certified assessments."
        />
        <StepCard
          number="3"
          title="Earn & Share"
          description="Pass with 60%+ on a paid exam to unlock your certificate."
        />
      </div>
    </section>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center p-6">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold">
        {number}
      </div>
      <h4 className="font-bold text-lg text-blue-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function FooterSection({ navigate }) {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <FooterBrand />
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
      <div className="border-t border-blue-700 py-4 text-center text-sm text-blue-200">
        EduMetric. Demo project - payments are simulated.
      </div>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white text-blue-900 flex items-center justify-center font-bold">
          E
        </div>
        <span className="font-bold text-lg">EduMetric</span>
      </div>
      <p className="text-blue-200 text-sm">
        Smart exam platform for students and institutions.
      </p>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-blue-200">
        {links.map((link, i) => (
          <li key={i}>
            {link.href ? (
              <a href={link.href} className="hover:text-white">
                {link.label}
              </a>
            ) : (
              <button onClick={link.onClick} className="hover:text-white">
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}