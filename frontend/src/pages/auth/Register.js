import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import logoImg from "../../images/home/logo1.png";
import { 
  MdError,
  MdCheckCircle,
  MdOutlineTrackChanges,
  MdOutlinePsychology,
  MdOutlineAnalytics,
  MdOutlineSchool,
  MdOutlineTimer,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

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
  const [isInstitutional, setIsInstitutional] = useState(false);
  const [institutionUserId, setInstitutionUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (isInstitutional && !institutionUserId.trim()) {
      newErrors.institutionUserId = "Helwan University ID is required";
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

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        isInstitutional,
        institutionUserId: isInstitutional ? institutionUserId : "",
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Something went wrong"); // 👈 show actual backend message
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
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl p-10 shadow-soft">
          {/* GLOW BACKGROUND LAYERS */}
          <div className="absolute w-96 h-96 bg-cyan-400/10 blur-[120px] rounded-full top-10 left-10" />
          <div className="absolute w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full bottom-10 right-10" />

          {/* TOP CONTENT */}
          <div className="relative z-10">

           {/* LOGO + BRAND */}
        <div className="relative flex items-center mb-10">

          {/* Main glow */}
          <div
            className="
              absolute
              w-44 h-44
              bg-cyan-300/15
              blur-2xl
              rounded-full
              -left-6
            "
          />

          {/* Secondary glow */}
          <div
            className="
              absolute
              w-28 h-28
              bg-white/10
              blur-xl
              rounded-full
              left-8
            "
          />

          {/* Logo */}
          <div className="relative w-60 h-36 flex items-center">
            <img
              src={logoImg}
              alt="EduMetric Logo"
              className="
                w-full h-full object-contain
                brightness-110
                contrast-105
                drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]
                hover:scale-105
                transition-all duration-500
              "
            />
          </div>

        </div>
            

            {/* TITLE */}
            <h2 className="text-3xl font-bold mb-3 leading-snug">
              Smart Learning Platform
            </h2>

            <p className="text-white/70 mb-8">
              Create exams, track progress, and unlock AI-powered learning insights
            </p>

            {/* FEATURES */}
            <div className="flex flex-col gap-4">

              {[
                { icon: MdOutlineTrackChanges, title: "Smart Question Bank", color: "text-cyan-300" },
                { icon: MdOutlinePsychology, title: "AI-Powered Generation", color: "text-purple-300" },
                { icon: MdOutlineAnalytics, title: "Advanced Analytics", color: "text-green-300" },
                { icon: MdOutlineSchool, title: "Auto Certificates", color: "text-yellow-200" },
                { icon: MdOutlineTimer, title: "Timed Exams System", color: "text-pink-300" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-cyan-400/20 hover:bg-white/20 hover:scale-[1.02] transition-all"
                >
                  <div>
                    <f.icon className={`text-xl text-cyan-200 drop-shadow-md`} />
                  </div>

                  <p className="font-medium">{f.title}</p>
                </div>
              ))}

            </div>
          </div>

          {/* BOTTOM TEXT */}
          <div className="mt-10 text-sm text-white/60">
            Join thousands of students worldwide
          </div>

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
            {/* User Type */}
            <div className="flex flex-col gap-1">
              <label className="text-textSoft text-base font-medium">
                I am a
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={(e) => {
                  handleChange(e);
                  // Teachers must be institutional (Helwan only)
                  if (e.target.value === "teacher") {
                    setIsInstitutional(true);
                  }
                }}
                className="border border-border rounded-xl p-3 bg-bg"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Helwan Membership */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-bg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInstitutional}
                  onChange={(e) => setIsInstitutional(e.target.checked)}
                  className="accent-primary cursor-pointer"
                />
                <span className="text-textMain text-sm font-medium">
                  I am a Helwan University member
                </span>
              </label>

              {isInstitutional && (
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-textSoft text-base font-medium">
                    Helwan University ID
                  </label>
                  <input
                    type="text"
                    value={institutionUserId}
                    onChange={(e) => setInstitutionUserId(e.target.value)}
                    placeholder="e.g., 2024001234"
                    className="border border-border rounded-xl p-3 bg-card 
          focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition-all"
                  />
                  {errors.institutionUserId && (
                    <p className="text-danger text-sm">
                      {errors.institutionUserId}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-textSoft text-base font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      w-full border border-border rounded-xl p-3 pr-12 bg-bg
                      focus:ring-2 focus:ring-primary/30
                      hover:border-primary/40 transition-all
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      text-textSoft hover:text-primary
                      transition
                    "
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={22} />
                    ) : (
                      <MdVisibility size={22} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-danger text-sm">{errors.password}</p>
                )}
              </div>

           {/* Confirm Password */}
                    <div className="flex flex-col gap-1">
                      <label className="text-textSoft text-base font-medium">
                        Confirm Password
                      </label>

                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="
                            w-full border border-border rounded-xl p-3 pr-12 bg-bg
                            focus:ring-2 focus:ring-primary/30
                            hover:border-primary/40 transition-all
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="
                            absolute right-4 top-1/2 -translate-y-1/2
                            text-textSoft hover:text-primary
                            transition
                          "
                        >
                          {showConfirmPassword ? (
                            <MdVisibilityOff size={22} />
                          ) : (
                            <MdVisibility size={22} />
                          )}
                        </button>
                      </div>

                      {errors.confirmPassword && (
                        <p className="text-danger text-sm">
                          {errors.confirmPassword}
                        </p>
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
