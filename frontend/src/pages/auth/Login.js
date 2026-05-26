import React, { useState } from "react";
import { FaEnvelope, FaLock} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  // Live Validation States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email Validation
  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Password Validation
  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

   let hasError = false;

    // Email validation
    if (!formData.email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Invalid email format");
      hasError = true;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!formData.password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) {
      setError("Please complete all required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // session support
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember_me: rememberMe,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // success
      setError("");
      setSuccess("Logged in successfully 🔥");
      setLoading(false);

  // ✅ Fixed — admin check is FIRST
  if (data.user_type === "admin") {
      navigate("/admindashboard");  // ← check what your admin route is called in App.js
  } else if (data.user_type === "teacher") {
      navigate("/instructordashboard");
  } else if (data.is_institutional) {
      navigate("/student");
  } else {
      navigate("/home");
  }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 ">
      <div className="w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 border border-border shadow-soft rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-center text-textMain mb-2">
            Welcome Back 👋
          </h2>

          <p className="text-center text-textSoft mb-6 text-sm">
            Login to your EduMetric account
          </p>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-xl mb-4 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-textSoft" />

                <input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData({
                      ...formData,
                      email: value,
                    });

                    validateEmail(value);

                    if (error) setError("");
                  }}
                  className={`mt-1 w-full pl-10 px-4 py-3 rounded-xl bg-bg border text-textMain placeholder-textSoft focus:outline-none focus:ring-2 transition
                    ${
                      emailError
                        ? "border-danger focus:ring-danger/30"
                        : "border-border focus:ring-primary/30 hover:border-primary/40"
                    }`}
                />
              </div>

              {emailError && (
                <p className="text-danger text-xs mt-1 ml-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-textSoft" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData({
                      ...formData,
                      password: value,
                    });

                    validatePassword(value);

                    if (error) setError("");
                  }}
                  className={`mt-1 w-full pl-10 px-4 py-3 rounded-xl bg-bg border text-textMain placeholder-textSoft focus:outline-none focus:ring-2 transition
                    ${
                      passwordError
                        ? "border-danger focus:ring-danger/30"
                        : "border-border focus:ring-primary/30 hover:border-primary/40"
                    }`}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-xs text-textSoft cursor-pointer hover:text-primary transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              {passwordError && (
                <p className="text-danger text-xs mt-1 ml-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-xs text-textSoft">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primaryLight hover:shadow-soft transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          
          {/* Footer */}
          <p className="text-center text-textSoft text-sm mt-6">
            Don’t have an account?
            <Link
              to="/Register"
              className="text-primary font-semibold hover:underline ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}