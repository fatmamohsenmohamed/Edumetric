// src/pages/AboutUs.js
import React, { useEffect, useState } from 'react';
import { FaUsers, FaGraduationCap, FaLightbulb } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutUs() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const team = [
    { name: 'Fatma Mohsen', role: 'Backend&System', img: 'https://via.placeholder.com/150' },
    { name: 'Nada Elbehiry', role: 'Frontend', img: 'https://via.placeholder.com/150' },
    { name: 'Ahmed Ihab', role: 'Frontend', img: 'https://via.placeholder.com/150' },
    { name: 'Shahd Mahmoud', role: 'System', img: 'https://via.placeholder.com/150' },
    { name: 'Mariam Yasser', role: 'Backend', img: 'https://via.placeholder.com/150' },
    { name: 'Nadine Badr', role: 'Business', img: 'https://via.placeholder.com/150' },
  ];

  const stats = [
    { icon: <FaUsers className=" text-4xl" />, number: '10k+', label: 'Students' },
    { icon: <FaGraduationCap className=" text-4xl" />, number: '500+', label: 'Courses' },
    { icon: <FaLightbulb className=" text-4xl" />, number: '200+', label: 'AI Questions' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 text-white overflow-hidden">

      {/* Floating shapes with parallax */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full animate-pulse"
        style={{ transform: `translateY(${offsetY * 0.3}px) translateX(-8rem) translateY(-8rem)` }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/30 rounded-full animate-pulse"
        style={{ transform: `translateY(${offsetY * -0.2}px) translateX(8rem) translateY(8rem)` }}
      ></div>

      <div className="relative z-10 flex flex-col items-center p-8">

        {/* Hero */}
        <div className="text-center max-w-4xl mb-16" data-aos="fade-down">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About EduMetric</h1>
          <p className="text-white/90 text-lg md:text-xl">
            Empowering students and educators with AI-powered learning tools and analytics.
          </p>
          <img
            src="https://via.placeholder.com/500x300"
            alt="Hero"
            className="mt-8 rounded-3xl shadow-2xl transition-transform duration-700 ease-out transform hover:scale-105"
          />
        </div>

        {/* Mission & Vision */}
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 mb-16">
          <div data-aos="fade-right" className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-white/90 mb-6">
              To revolutionize learning by providing smart, AI-driven educational tools that help students succeed and educators thrive.
            </p>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-white/90">
              To be the leading platform for digital education worldwide, fostering creativity, knowledge, and growth for all learners.
            </p>
          </div>
          <div data-aos="fade-left" className="flex justify-center items-center">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Mission"
              className="rounded-3xl shadow-2xl transition-transform duration-700 transform hover:-translate-y-4 hover:scale-105"
            />
          </div>
        </div>

        {/* Team */}
        <div className="w-full max-w-6xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mb-4 shadow-lg border-4 border-white/20 transition-transform duration-500 transform hover:rotate-3"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-white/80">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              className="bg-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:bg-white/20"
            >
              {stat.icon}
              <h3 className="text-3xl font-extrabold mt-4">{stat.number}</h3>
              <p className="text-white/80 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-extrabold mb-4">Ready to get started?</h2>
          <p className="text-white/90 mb-6">Join EduMetric today and take your learning to the next level!</p>
          <a
            href="/register"
            className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
          >
            Sign Up Now
          </a>
        </div>

      </div>
    </div>
  );
}