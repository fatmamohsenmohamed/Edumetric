import React, { useEffect, useState } from "react";
import { FaUsers, FaGraduationCap, FaLightbulb } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImg from "../../images/about/about_1.svg";
import missionImg from "../../images/about/about_2.svg";
import femaleImg from "../../images/about/female.svg";
import maleImg from "../../images/about/male.svg";

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
  { icon: FaUsers, number: "10k+", label: "Students" },
  { icon: FaGraduationCap, number: "500+", label: "Courses" },
  { icon: FaLightbulb, number: "200+", label: "AI Questions" },
];

  return (
    <div className="relative min-h-screen bg-bg text-textMain overflow-hidden  pt-24">
          <Navbar activePage="about" />

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

          <img
            src={heroImg}
            alt="EduMetric Hero Illustration"
            className="
              w-80 md:w-96 mx-auto mb-6
              drop-shadow-[0_10px_40px_rgba(34,211,238,0.25)]
              hover:scale-105 transition
            "
          />

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            About EduMetric
          </h1>

          <p className="text-textSoft text-lg md:text-xl">
            Empowering students and educators with AI-powered learning tools and analytics.
          </p>

        </div>

        {/* MISSION */}
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 mb-16 ">

          <div 
            data-aos="fade-right"
            className="flex flex-col justify-center h-full"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-textSoft mb-6 leading-8">
              To revolutionize learning by providing smart, AI-driven educational tools.
            </p>

            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-textSoft leading-8">
              To be the leading platform for digital education worldwide.
            </p>
          </div>

          <div data-aos="fade-left">
            <img
              src={missionImg}
              alt="EduMetric Mission Illustration"
              className="
                w-80 mx-auto
                rounded-3xl
                shadow-[0_10px_50px_rgba(0,0,0,0.25)]
                hover:scale-105
                transition-all duration-300
                border border-white/10
              "
            />
          </div>

        </div>

        {/* TEAM */}
        <div className="relative w-full max-w-6xl mb-16">
          <div className="absolute w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10 top-20 left-1/2 -translate-x-1/2" />
          <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className="
                 bg-white/5 border border-white/10
                  rounded-3xl p-6
                  backdrop-blur-xl
                  shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                  flex flex-col items-center
                  hover:bg-white/10 hover:border-primary/30
                  hover:scale-[1.03]
                  transition-all duration-300
                "
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={member.name === "Ahmed Ihab" ? maleImg : femaleImg}
                    alt={member.name}
                    className="
                      w-20 h-20 rounded-full
                      object-cover
                      border-2 border-primary/40
                      shadow-lg
                      shadow-primary/20
                    "
                  />

                  <h3 className="text-xl font-bold">
                    {member.name}
                  </h3>

                  <p className="text-textSoft">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="relative w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="absolute right-0 top-10 w-80 h-80 bg-cyan-400/10 blur-[100px] rounded-full -z-10" />
          {stats.map((stat, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              className="
                bg-white/5 border border-white/10
                rounded-3xl p-6
                backdrop-blur-xl
                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                flex flex-col items-center text-center
                hover:bg-white/10 hover:border-primary/30
                hover:scale-[1.03]
                transition-all duration-300
              "
            >
              
              <div className="text-primary text-4xl drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                <stat.icon />
              </div>

              <h3 className="text-3xl font-extrabold mt-4">
                {stat.number}
              </h3>

              <p className="text-textSoft mt-2">
                {stat.label}
              </p>

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
      <Footer activePage="about" />
    </div>
  );
}