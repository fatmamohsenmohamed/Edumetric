import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../styles/register.css";

export default function Register() {
  useEffect(() => {
    if (window.initializeForm) {
      window.initializeForm();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Branding */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                📚
              </div>
              <h1 className="text-3xl font-bold">EduMetric</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">Smart Learning Platform</h2>
            <p className="text-white/90 mb-12">
              Create and take exams with AI-powered questions and real-time
              analytics
            </p>

            <div className="flex flex-col gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Smart Question Bank",
                  subtitle: "Create and manage exam questions",
                },
                {
                  icon: "🤖",
                  title: "AI-Powered Generation",
                  subtitle: "Automatic question generation",
                },
                {
                  icon: "📊",
                  title: "Performance Analytics",
                  subtitle: "Track progress with detailed charts",
                },
                {
                  icon: "🎓",
                  title: "Certificates",
                  subtitle: "Earn certificates on completion",
                },
                {
                  icon: "⏱️",
                  title: "Timed Exams",
                  subtitle: "Real-time countdown timer",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-4 bg-white/10 rounded-lg border-l-4 border-white/30 hover:bg-white/12 hover:border-white/60 transition transform duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-white/15 rounded-lg text-2xl">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-white">{f.title}</p>
                    <p className="text-white/80 text-sm">{f.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-white/30 text-center text-white/80 text-sm">
            Join thousands of students and educators worldwide
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col gap-6 register-form-container">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mb-6">Join EduMetric today</p>

          <form className="flex flex-col gap-5" id="registerForm">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="fullName" className="text-gray-700 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
              <p className="text-red-600 text-sm" id="fullNameError"></p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-700 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
              <p className="text-red-600 text-sm" id="emailError"></p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">
                Phone Number
              </label>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <select
                  id="countryCode"
                  name="countryCode"
                  className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="+1">+1 USA/Canada</option>
                  <option value="+20">+20 Egypt</option>
                  <option value="+966">+966 Saudi Arabia</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <p className="text-red-600 text-sm" id="phoneError"></p>
            </div>

            {/* User Type */}
            <div className="flex flex-col gap-1">
              <label htmlFor="userType" className="text-gray-700 font-semibold">
                I am a
              </label>
              <select
                id="userType"
                name="userType"
                className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="institution">Institution</option>
              </select>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Min. 8 characters"
                className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 pr-12"
              />
              <button
                type="button"
                id="passwordToggle"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                👁️
              </button>
              <p className="text-red-600 text-sm" id="passwordError"></p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1 relative">
              <label
                htmlFor="confirmPassword"
                className="text-gray-700 font-semibold"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 pr-12"
              />
              <button
                type="button"
                id="confirmPasswordToggle"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                👁️
              </button>
              <p className="text-red-600 text-sm" id="confirmPasswordError"></p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                className="w-5 h-5 accent-purple-500"
              />
              <label htmlFor="agreeToTerms" className="text-gray-700 text-sm">
                I agree to the{" "}
                <a href="/" className="text-purple-500 font-semibold">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/" className="text-purple-500 font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>
            <p className="text-red-600 text-sm" id="agreeToTermsError"></p>

            {/* Submit */}
            <button
              type="submit"
              id="submitBtn"
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-500 mt-3">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
