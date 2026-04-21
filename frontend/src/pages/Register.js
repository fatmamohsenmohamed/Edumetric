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
  const [success, setSuccess] = useState("");  /////////////////
  const [termsAccepted, setTermsAccepted] = useState(false); ///////////////////
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
      }, 2000); //2 sec instead of 1200 equivelent to 1.2 min

      return;
    }

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
      window.location.href = "/dashboard"; //  team decides the route
      }, 2000); // 2000 = 2 seconds

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
      {success && (
    <div style={{
        position: "fixed", top: "20px", right: "20px",
        backgroundColor: "green", color: "white",
        padding: "10px 20px", borderRadius: "5px",
        fontSize: "16px", zIndex: 9999,
    }}>
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

                {/* FEATURES */}
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
                      className="flex gap-5 p-4 bg-white/10 rounded-lg border-l-4 border-white/30 hover:bg-white/12 hover:border-white/60 transition"
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
                    placeholder="John Doe"
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
                    placeholder="you@example.com"
                    className="border-2 border-gray-200 rounded-lg p-3"
                  />
                </div>

                {/* Phone (UI only – not connected to state) */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold">
                    Phone Number
                  </label>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <select className="border-2 border-gray-200 rounded-lg p-3">
                      <option value="+1">+1 USA/Canada</option>
                      <option value="+20">+20 Egypt</option>
                      <option value="+966">+966 Saudi Arabia</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="border-2 border-gray-200 rounded-lg p-3"
                    />
                  </div>
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
                    placeholder="Min. 8 characters"
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
                    placeholder="Confirm password"
                    className="border-2 border-gray-200 rounded-lg p-3"
                  />
                </div>

                {/* Terms (UI only) */}
                <div className="flex items-start gap-2">
                  {/*  Now connected to termsAccepted state */}
                  <input
                      type="checkbox"
                      className="w-5 h-5 accent-purple-500"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="text-gray-700 text-sm">
                    I agree to the{" "}
                    <span className="text-purple-500 font-semibold">
                      Terms & Conditions
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!termsAccepted}
                    className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
                    style={{
                        opacity: termsAccepted ? 1 : 0.5,   // dims when disabled
                        cursor: termsAccepted ? "pointer" : "not-allowed"  // shows X cursor when disabled
                    }}
                >
                    Create Account
                </button>
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
