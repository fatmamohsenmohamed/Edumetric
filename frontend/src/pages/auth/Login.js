import React, { useState } from "react";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => { 
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

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
      setSuccess("Logged in successfully 🔥");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
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
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-textSoft" />
              <input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full pl-10 px-4 py-3 rounded-xl bg-bg border border-border text-textMain placeholder-textSoft  focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-textSoft" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 w-full pl-10 px-4 py-3 rounded-xl bg-bg border border-border text-textMain placeholder-textSoft  focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-textSoft cursor-pointer hover:text-primary transition"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-xs text-textSoft">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primaryLight hover:shadow-soft transition  flex justify-center items-center gap-2"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-border"></div>
            <span className="mx-3 text-textSoft text-xs">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-card border border-border text-textMain hover:bg-primary/5 transition flex justify-center items-center gap-2">
              <FaGoogle className="text-danger" /> Google
            </button>
            <button className="flex-1 py-3 rounded-xl bg-card border border-border text-textMain hover:bg-primary/5 transition flex justify-center items-center gap-2">
              <FaFacebook className="text-primary" /> Facebook
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-textSoft text-sm mt-6">
            Don’t have an account?
            <Link
              to="/Register"
              className="text-primary font-semibold hover:underline "
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
