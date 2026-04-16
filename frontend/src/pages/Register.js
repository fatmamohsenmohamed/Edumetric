import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/register.css";
// useState → stores your form data
// formData → current values
// setFormData → updates values
export default function Register() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userType: "student",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
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
      // de a5r haga w2fna 3ndha 3yzin nzhr el message fel UI

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

      return;
    } else {
      setMessage(data.error || "Something went wrong");
    }

    // 👇 success case
    console.log("Response from backend:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branding (UNCHANGED) */}
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

          {/* Form (UNCHANGED UI) */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col gap-6 register-form-container">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mb-6">Join EduMetric today</p>

            <div className="flex flex-col gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-semibold">Full Name</label>
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
                <label
                  htmlFor="userType"
                  className="text-gray-700 font-semibold"
                >
                  I am a
                </label>

                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="institution">Institution</option>
                </select>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-gray-700 font-semibold">Password</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-lg p-3 pr-12"
                />

                <button
                  type="button"
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-lg p-3 pr-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                >
                  👁️
                </button>

                <p
                  className="text-red-600 text-sm"
                  id="confirmPasswordError"
                ></p>
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
  );
}
