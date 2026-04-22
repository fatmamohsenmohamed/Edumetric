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
  const [success, setSuccess] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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

      setError("Account exists. Login");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

      return;
    }

    setSuccess("Account created successfully! Redirecting...");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);

    setError("");
    console.log("Response from backend:", data);
  };

  return (
    <>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {/* ✅ FRIEND'S SUCCESS MESSAGE */}
      {success && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "16px",
            zIndex: 9999,
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

                <h2 className="text-3xl font-bold mb-4">
                  Smart Learning Platform
                </h2>

                <p className="text-white/90 mb-12">
                  Create and take exams with AI-powered questions and real-time
                  analytics
                </p>
              </div>

              <div className="pt-8 border-t border-white/30 text-center text-white/80 text-sm">
                Join thousands of students and educators worldwide
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
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border-2 border-gray-200 rounded-lg p-3"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border-2 border-gray-200 rounded-lg p-3"
                />

                {/* User Type */}
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

                {/* Password */}
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="border-2 border-gray-200 rounded-lg p-3"
                />

                {/* Confirm Password */}
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="border-2 border-gray-200 rounded-lg p-3"
                />

                {/* Terms */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="text-sm">
                    I agree to the Terms & Conditions
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!termsAccepted}
                  className="bg-purple-600 text-white p-3 rounded-lg"
                  style={{
                    opacity: termsAccepted ? 1 : 0.5,
                    cursor: termsAccepted ? "pointer" : "not-allowed",
                  }}
                >
                  Create Account
                </button>
              </div>

              <p className="text-center text-gray-500 mt-3">
                Already have an account?{" "}
                <Link to="/Login" className="text-purple-600">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
