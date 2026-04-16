import React, { useState } from "react";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // session support
        body: JSON.stringify(formData),
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

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

      // optional redirect
      // window.location.href = "/dashboard";
    } catch (err) {
      setLoading(false);
      setError(err.message || "Server error. Try again later.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-center text-white/70 mb-6 text-sm">
            Login to your EduMetric account
          </p>

          {error && (
            <div className="bg-red-500/20 text-red-200 text-sm p-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-white/70" />
              <input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full pl-10 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-white/70" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 w-full pl-10 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-white/70 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-xs text-white/70">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-pink-500" />
                Remember me
              </label>
              <span className="hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-white text-purple-600 font-semibold hover:scale-105 transition-transform shadow-lg flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="mx-3 text-white/60 text-xs">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex justify-center items-center gap-2">
              <FaGoogle /> Google
            </button>
            <button className="flex-1 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex justify-center items-center gap-2">
              <FaFacebook /> Facebook
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-white/70 text-sm mt-6">
            Don’t have an account?
            <Link
              to="/Register"
              className="text-white font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
