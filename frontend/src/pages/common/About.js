import React, { useEffect, useState } from "react";
import { FaUsers, FaGraduationCap, FaLightbulb } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const team = [
    { name: "Fatma Mohsen", role: "Backend & System" },
    { name: "Nada Elbehiry", role: "Frontend" },
    { name: "Ahmed Ihab", role: "Frontend" },
    { name: "Shahd Mahmoud", role: "System" },
    { name: "Mariam Yasser", role: "Backend" },
    { name: "Nadine Badr", role: "Business" },
  ];

  const stats = [
    { icon: <FaUsers className="text-4xl text-primary" />, number: "10k+", label: "Students" },
    { icon: <FaGraduationCap className="text-4xl text-primary" />, number: "500+", label: "Courses" },
    { icon: <FaLightbulb className="text-4xl text-primary" />, number: "200+", label: "AI Questions" },
  ];

  return (
    <div className="relative min-h-screen bg-bg text-textMain overflow-hidden">

      {/* Floating shapes */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
        style={{ transform: `translateY(${offsetY * -0.2}px)` }}
      />

      <div className="relative z-10 flex flex-col items-center p-8">

        {/* HERO */}
        <div className="text-center max-w-4xl mb-16" data-aos="fade-down">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            About EduMetric
          </h1>
          <p className="text-textSoft text-lg md:text-xl">
            Empowering students and educators with AI-powered learning tools and analytics.
          </p>

        </div>

        {/* MISSION */}
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 mb-16">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-textSoft mb-6">
              To revolutionize learning by providing smart, AI-driven educational tools.
            </p>

            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-textSoft">
              To be the leading platform for digital education worldwide.
            </p>
          </div>

        </div>

        {/* TEAM */}
        <div className="w-full max-w-6xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-soft"
              >
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-textSoft">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-soft"
            >
              {stat.icon}
              <h3 className="text-3xl font-extrabold mt-4">{stat.number}</h3>
              <p className="text-textSoft mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to get started?
          </h2>

          <p className="text-textSoft mb-6">
            Join EduMetric today and take your learning to the next level!
          </p>

          <a
            href="/register"
            className="bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-soft hover:bg-primaryLight transition hover:scale-105"
          >
            Sign Up Now
          </a>
        </div>

      </div>
    </div>
  );
}