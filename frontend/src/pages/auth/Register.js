import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { MdError, MdCheckCircle } from "react-icons/md";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+20",
    userType: "student",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const accepted = localStorage.getItem("acceptedTerms");

    if (accepted === "true") {
      setFormData((prev) => ({
        ...prev,
        agree: true,
      }));
    }
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";

    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email";

    if (formData.phone.length < 10)
      newErrors.phone = "Enter valid phone number";

    if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agree) {
      newErrors.agree = "You must accept Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= CHANGE =================
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError("Account already exists. Please login.");
      return;
    }

    setSuccess("Account created! check your email.");
    // setSuccess("Account created successfully 🎉");

    // setTimeout(() => {
    //   window.location.href =
    //     data.user_type === "teacher"
    //       ? "/teacher"
    //       : "/student-dashboard";
    // }, 1200);

    //hna 34an a3ml confirmation ll email w b3d kda aro7 ll login
  };
  // ================= TERMS =================
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      {/* ALERTS */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {error && (
          <div className="flex items-center gap-2 bg-danger/10 text-danger px-4 py-2 rounded-xl border border-danger/20 shadow-soft">
            <MdError /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-xl border border-success/20 shadow-soft">
            <MdCheckCircle /> {success}
          </div>
        )}
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-between bg-primary text-white rounded-2xl p-10 shadow-soft">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">
                📚
              </div>
              <h1 className="text-2xl font-bold">EduMetric</h1>
            </div>

            <h2 className="text-2xl font-bold mb-3">Smart Learning Platform</h2>

            <p className="text-white/70 mb-10">
              Create and take exams with AI-powered questions and analytics
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: "🎯", title: "Smart Question Bank" },
                { icon: "🤖", title: "AI-Powered Generation" },
                { icon: "📊", title: "Performance Analytics" },
                { icon: "🎓", title: "Certificates" },
                { icon: "⏱️", title: "Timed Exams" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/20 
                  hover:bg-white/20 hover:translate-x-1 transition-all"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg text-lg">
                    {f.icon}
                  </div>
                  <p className="font-medium">{f.title}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/60 mt-10">
            Join thousands of students worldwide
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-card border border-border rounded-2xl p-10 shadow-soft">
          <h2 className="text-2xl font-bold text-textMain">Create Account</h2>
          <p className="text-textSoft mb-6">Join EduMetric today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                Full Name
              </label>
              <input
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="border border-border rounded-xl p-3 bg-bg 
                focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition-all"
              />
              {errors.fullName && (
                <p className="text-danger text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border border-border rounded-xl p-3 bg-bg 
                focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition-all"
              />
              {errors.email && (
                <p className="text-danger text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                Phone Number
              </label>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="border border-border rounded-xl p-3 bg-bg"
                >
                  <option value="+20">+20 Egypt</option>
                  <option value="+1">+1 USA</option>
                  <option value="+966">+966 KSA</option>
                </select>

                <input
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-border rounded-xl p-3 bg-bg 
                  focus:ring-2 focus:ring-primary/30 hover:border-primary/40"
                />
              </div>
              {errors.phone && (
                <p className="text-danger text-sm">{errors.phone}</p>
              )}
            </div>

            {/* User Type */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                I am a
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="border border-border rounded-xl p-3 bg-bg"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="border border-border rounded-xl p-3 bg-bg"
              />
              {errors.password && (
                <p className="text-danger text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border border-border rounded-xl p-3 bg-bg"
              />
              {errors.confirmPassword && (
                <p className="text-danger text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 accent-primary cursor-pointer"
              />

              <label className="text-textSoft text-sm">
                I agree to the{" "}
                <span
                  onClick={() => setShowTerms(true)}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Terms & Conditions
                </span>
              </label>
            </div>
            {errors.agree && (
              <p className="text-danger text-xs mt-1">{errors.agree}</p>
            )}

            {/* popup */}
            {showTerms && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-card w-full max-w-2xl p-6 rounded-2xl shadow-soft relative animate-scaleIn">
                  {/* Close */}
                  <button
                    onClick={() => setShowTerms(false)}
                    className="absolute top-3 right-3 text-textSoft hover:text-textMain text-lg"
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-bold text-textMain mb-4">
                    Terms & Conditions
                  </h2>

                  <div className="text-textSoft text-sm space-y-3 max-h-64 overflow-y-auto pr-2">
                    <p>
                      By using EduMetric, you agree to our platform rules...
                    </p>
                    <p>You are responsible for your account security.</p>
                    <p>We protect your data and privacy.</p>
                    <p>Any misuse may lead to account termination.</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-6">
                    <Link
                      to="/terms"
                      className="text-primary text-sm hover:underline"
                    >
                      View full page
                    </Link>

                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          agree: true,
                        }));

                        setShowTerms(false);
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primaryLight"
                    >
                      I Agree
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl 
              hover:bg-primaryLight hover:shadow-soft transition-all"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-textSoft mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
