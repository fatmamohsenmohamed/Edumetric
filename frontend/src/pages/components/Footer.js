import { useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdArrowOutward,
} from "react-icons/md";
import logoImg from "../../images/home/logo1.png";

export default function Footer({ activePage }) {
  const navigate = useNavigate();

  function handleNavClick(href) {
    if (activePage === "home") {
      document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", href);
      navigate("/home");
    }
  }

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
                { label: "Exams", onClick: () => handleNavClick("exams") },
                { label: "Pricing", onClick: () => navigate("/pricing") },
                { label: "Features", onClick: () => handleNavClick("features") },
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
              <span
                onClick={() => navigate("/terms")}
                className="hover:text-white transition cursor-pointer"
              >
                Terms
              </span>
              <span
                onClick={() => navigate("/privacy")}
                className="hover:text-white transition cursor-pointer"
              >
                Privacy
              </span>
              <span
                onClick={() => navigate("/contact")}
                className="hover:text-white transition cursor-pointer"
              >
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
        <button
            onClick={() => navigate("/home")}
            className="focus:outline-none"
          >
          <img
            src={logoImg}
            alt="EduMetric Logo"
            className="w-auto h-20 object-contain p-1 rounded-lg"
          />
        </button>
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
      <h4 className="font-bold text-lg mb-5 text-white">{title}</h4>

      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}