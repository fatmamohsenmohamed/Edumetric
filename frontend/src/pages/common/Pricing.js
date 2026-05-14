import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;
  const examTitle = location.state?.examTitle;

  const [user, setUser] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });

    fetch("http://localhost:8000/api/me/", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  function handleLogout() {
    fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    }).finally(() => navigate("/login"));
  }

  const plans = [
    {
      title: "Basic",
      price: "$10/mo",
      features: ["Access to question bank", "Basic analytics", "Email support"],
      highlight: false,
    },
    {
      title: "Pro",
      price: "$25/mo",
      features: [
        "Everything in Basic",
        "AI-powered question generation",
        "Advanced analytics",
        "Priority support",
      ],
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "$50/mo",
      features: [
        "Everything in Pro",
        "Custom branding",
        "Team management",
        "Dedicated account manager",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col  pt-24">
      <Navbar user={user} onLogout={handleLogout} activePage="pricing" />
      <div className="flex flex-col items-center justify-start p-10 flex-1">
      {/* Header */}
      <div className="max-w-7xl w-full text-center mb-16" data-aos="fade-down">
        <h1 className="text-5xl font-extrabold text-textMain mb-4">
          Choose Your Plan
        </h1>
        <p className="text-textSoft text-xl">
          Flexible pricing plans to suit every learner and educator
        </p>
      </div>

      {examId && (
        <div
          className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-8 max-w-3xl text-center"
          data-aos="fade-down"
        >
          <p className="text-amber-700 font-medium">
            🎓 Subscribe to unlock: <strong>{examTitle}</strong>
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl items-center ">
        {plans.map((plan, i) => (
          <div
            key={i}
            data-aos="zoom-in"
            data-aos-delay={i * 150}
            className={`relative flex flex-col rounded-2xl border transition-all duration-500 
            transform group overflow-hidden
            ${
              plan.highlight
                ? "bg-primary text-white border-primary scale-105 p-12 shadow-2xl"
                : "bg-card text-textMain border-border p-10 shadow-soft hover:scale-105 hover:shadow-xl"
            }`}
          >
            <h2 className="text-3xl font-bold mb-5 z-10">{plan.title}</h2>
            <p className="text-4xl font-extrabold mb-8 z-10">{plan.price}</p>

            <ul className="flex-1 flex flex-col gap-4 mb-8 z-10">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  <span className="text-primary font-bold text-lg">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                navigate("/checkout", { state: { plan, examId, examTitle } })
              }
              className={`py-4 rounded-xl font-semibold text-lg transition-all z-10 ${
                plan.highlight
                  ? "bg-white text-primary hover:bg-white/90 hover:scale-105"
                  : "bg-primary text-white hover:bg-primaryLight hover:scale-105"
              }`}
            >
              {plan.highlight ? "Get Started" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Note */}
      <p
        className="text-textSoft text-base mt-16 max-w-2xl text-center"
        data-aos="fade-up"
        data-aos-delay={400}
      >
        All plans come with a 14-day free trial. No credit card required.
      </p>

      </div>
      <Footer />
    </div>
  );
}