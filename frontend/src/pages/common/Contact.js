import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import onlineImg from "../../images/contact/online-communication.svg";

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (form.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ message: "", type: "" });

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setStatus({
          message: data.error || "Something went wrong",
          type: "error",
        });
        return;
      }

      setStatus({
        message: "Message sent successfully 🎉",
        type: "success",
      });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setLoading(false);
      setStatus({
        message: "Server error. Try again later",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col pt-24">
      <Navbar activePage="contact" />
      <div className="w-full flex flex-col items-center p-8">

      {/* STATUS ANIMATION */}
      {status.message && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm text-center w-full max-w-xl border animate-fadeIn transform transition-all duration-300 scale-100 hover:scale-[1.01]
          ${
            status.type === "success"
              ? "bg-success/10 text-success border-success/30"
              : "bg-danger/10 text-danger border-danger/30"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* HEADER ANIMATION */}
      <div
        className="text-center max-w-4xl mb-12"
        data-aos="fade-down"
      >
        <h1 className="text-4xl font-bold text-textMain mb-4 transition-all duration-300 hover:tracking-wide">
          Get in Touch
        </h1>
        <p className="text-textSoft transition-all duration-300 hover:text-textMain">
          We’d love to hear from you
        </p>
      </div>

      {/* GRID */}
       <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* FORM */}
        <div
          className="bg-card border border-border rounded-3xl p-10 shadow-soft transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          data-aos="fade-right"
        >

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* NAME */}
            <div className="transition-all duration-200 hover:scale-[1.01]">
              <label className="text-textMain text-sm mb-1 block">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-bg border border-border transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && (
                <p className="text-danger text-xs mt-1 animate-fadeIn">
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="transition-all duration-200 hover:scale-[1.01]">
              <label className="text-textMain text-sm mb-1 block">
                Email
              </label>
              <input
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-bg border border-border transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1 animate-fadeIn">
                  {errors.email}
                </p>
              )}
            </div>

            {/* SUBJECT */}
            <div className="transition-all duration-200 hover:scale-[1.01]">
              <label className="text-textMain text-sm mb-1 block">
                Subject
              </label>
              <input
                name="subject"
                placeholder="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-bg border border-border transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
              />
              {errors.subject && (
                <p className="text-danger text-xs mt-1 animate-fadeIn">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* MESSAGE */}
            <div className="transition-all duration-200 hover:scale-[1.01]">
              <label className="text-textMain text-sm mb-1 block">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Your message..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-bg border border-border transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20"
              />
              {errors.message && (
                <p className="text-danger text-xs mt-1 animate-fadeIn">
                  {errors.message}
                </p>
              )}
            </div>

            {/* BUTTON ANIMATION */}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send Message"
              )}
            </button>

          </form>
        </div>

        {/* INFO ANIMATION */}
        <div
          className="flex flex-col justify-start items-center gap-8 text-textMain h-full pt-6 md:pt-0"
          data-aos="fade-left"
        >
          <div className="flex justify-center">
          <img
            src={onlineImg}
            alt="Online Communication"
            className="w-64 md:w-72 -mt-4 md:-mt-8"
          />
        </div>

          <div className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
            <FaMapMarkerAlt className="text-primary" />
            <span className="text-textSoft">Cairo, Egypt</span>
          </div>

          <div className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
            <FaPhone className="text-primary" />
            <span className="text-textSoft">+20 123 456 789</span>
          </div>

          <div className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
            <FaEnvelope className="text-primary" />
            <span className="text-textSoft">edumetric.plattform2026@gmail.com</span>
          </div>

          <div className="flex gap-4 text-primary text-lg">
            <FaFacebookF className="hover:scale-110 transition" />
            <FaTwitter className="hover:scale-110 transition" />
            <FaLinkedinIn className="hover:scale-110 transition" />
          </div>

        </div>
      </div>
      </div>
      <Footer activePage="contact" />
    </div>
  );
}