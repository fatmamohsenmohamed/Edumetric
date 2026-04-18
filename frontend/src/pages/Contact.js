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

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [status, setStatus] = useState({
    message: "",
    type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          message: data.error || "Something went wrong",
          type: "error",
        });
        return;
      }

      setStatus({
        message: "Message sent successfully!",
        type: "success",
      });

      e.target.reset();
    } catch (error) {
      setStatus({
        message: "Server error. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 flex flex-col items-center p-8">
      {/* STATUS MESSAGE (like login alert) */}
      {status.message && (
        <div
          className={`mb-6 px-4 py-2 rounded-lg text-white text-center w-full max-w-xl ${
            status.type === "success" ? "bg-green-500/80" : "bg-red-500/80"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-4xl mb-12" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-white/90 text-lg md:text-xl">
          We’d love to hear from you! Fill out the form or reach us via our
          contact info below.
        </p>
      </div>

      {/* GRID */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* FORM */}
        <div
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          data-aos="fade-right"
        >
          {status.message && status.type === "error" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center shadow-sm">
              {status.message}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-6 z-10"
          >
            {/* NAME */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="border-2 border-gray-200 rounded-lg p-3"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border-2 border-gray-200 rounded-lg p-3"
              />
            </div>

            {/* SUBJECT */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">Subject</label>
              <input
                name="subject"
                type="text"
                placeholder="Subject"
                className="border-2 border-gray-200 rounded-lg p-3"
              />
            </div>

            {/* MESSAGE */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">Message</label>
              <textarea
                name="message"
                rows={6}
                placeholder="Type your message..."
                className="border-2 border-gray-200 rounded-lg p-3 resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-8 text-white" data-aos="fade-left">
          <h2 className="text-3xl font-bold mb-6">Contact Info</h2>

          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-purple-300 text-xl" />
            <span>123 St, Cairo, Egypt</span>
          </div>

          <div className="flex items-center gap-4">
            <FaPhone className="text-purple-300 text-xl" />
            <span>+20 123 456 7890</span>
          </div>

          <div className="flex items-center gap-4">
            <FaEnvelope className="text-purple-300 text-xl" />
            <span>support@edumetric.com</span>
          </div>

          <div className="flex gap-4 mt-8">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
          </div>

          <p className="text-white/80 mt-8 text-sm">
            We typically respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
