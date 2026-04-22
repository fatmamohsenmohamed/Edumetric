
import React, { useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ContactUs() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 flex flex-col items-center p-8">

      {/* address*/}
      <div className="text-center max-w-4xl mb-12" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-white/90 text-lg md:text-xl">
          We’d love to hear from you! Fill out the form or reach us via our contact info below.
        </p>
      </div>

      {/* Section Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden" data-aos="fade-right">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/20 via-indigo-50/10 to-transparent pointer-events-none rounded-3xl"></div>

          <form className="relative flex flex-col gap-6 z-10">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-700 font-semibold">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-700 font-semibold">Email Address</label>
              <input type="email" id="email" placeholder="you@example.com" className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="subject" className="text-gray-700 font-semibold">Subject</label>
              <input type="text" id="subject" placeholder="Subject" className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-gray-700 font-semibold">Message</label>
              <textarea id="message" placeholder="Type your message..." rows={6} className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none" />
            </div>

            <button type="submit" className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition">
              Send Message
            </button>
          </form>

        </div>

        {/* Contact Info */}
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
            <a href="/" className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition">
              <FaFacebookF />
            </a>
            <a href="/" className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition">
              <FaTwitter />
            </a>
            <a href="/" className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition">
              <FaLinkedinIn />
            </a>
          </div>

          <p className="text-white/80 mt-8 text-sm">
            We typically respond within 24 hours. Looking forward to connecting with you!
          </p>
        </div>

      </div>
    </div>
  );
}