import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userType: "student",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data);

      setError("Email already exists. Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

      return;
    }

    setError("");
    console.log("Response from backend:", data);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {error && (
              <div className="col-span-full bg-red-500/20 text-red-200 text-sm p-2 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Branding */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                    📚
                  </div>
                  <h1 className="text-3xl font-bold">EduMetric</h1>
                </div>

                <h2 className="text-3xl font-bold mb-4">
                  Smart Learning Platform
                </h2>

                <p className="text-white/90 mb-12">
                  Create and take exams with AI-powered questions and real-time
                  analytics
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col gap-6 register-form-container">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="text-gray-500 mb-6">Join EduMetric today</p>

              <div className="flex flex-col gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-lg p-3"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-lg p-3"
                  />
                </div>

                {/* User Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold">I am a</label>

                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-lg p-3"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="institution">Institution</option>
                  </select>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-lg p-3"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-lg p-3"
                  />
                </div>

                {/* Submit */}
                <button type="submit">Create Account</button>
              </div>

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
      </form>
    </>
  );
}
