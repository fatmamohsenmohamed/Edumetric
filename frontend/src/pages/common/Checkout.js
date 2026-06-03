import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCreditCard, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// ================= VALIDATION RULES =================
const validators = {
  name: {
    validate: (v) =>
      v.trim().length > 2 && /^[a-zA-Z\u0600-\u06FF\s]+$/.test(v.trim()),
    message: (v) => {
      if (!v.trim()) return "Cardholder name is required";
      if (v.trim().length <= 2) return "Name must be at least 3 characters";
      if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(v.trim()))
        return "Name must contain letters only";
      return "";
    },
  },
  cardNumber: {
    validate: (v) =>
      v.replace(/\s/g, "").length === 16 &&
      /^\d+$/.test(v.replace(/\s/g, "")),
    message: (v) => {
      const d = v.replace(/\s/g, "");
      if (!d) return "Card number is required";
      if (!/^\d+$/.test(d)) return "Card number must contain digits only";
      if (d.length < 16)
        return `${16 - d.length} more digit${16 - d.length > 1 ? "s" : ""} needed`;
      return "";
    },
  },
  expiry: {
    validate: (v) => {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v)) return false;
      const [m, y] = v.split("/").map(Number);
      const now = new Date();
      const cy = now.getFullYear() % 100;
      const cm = now.getMonth() + 1;
      return y > cy || (y === cy && m >= cm);
    },
    message: (v) => {
      if (!v) return "Expiry date is required";
      if (!/^\d{2}\/\d{2}$/.test(v)) return "Use MM/YY format (e.g. 08/27)";
      const [m] = v.split("/").map(Number);
      if (m < 1 || m > 12) return "Month must be between 01 and 12";
      return "This card has expired";
    },
  },
  cvv: {
    validate: (v) => /^\d{3,4}$/.test(v),
    message: (v) => {
      if (!v) return "CVV is required";
      if (!/^\d+$/.test(v)) return "CVV must be digits only";
      if (v.length < 3) return "CVV must be 3 or 4 digits";
      return "";
    },
  },
};

// ================= FIELD COMPONENT =================
function Field({ id, label, children, error, touched }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-textSoft">{label}</label>
      {children}
      <div className={`flex items-center gap-1 text-xs text-danger transition-all duration-200 ${touched && error ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}
        style={{ minHeight: "18px" }}>
        <FaExclamationCircle className="shrink-0" />
        <span>{error}</span>
      </div>
    </div>
  );
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const plan = location.state?.plan;
  const examId = location.state?.examId;

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Track which fields the user has interacted with
  const [touched, setTouched] = useState({
    name: false,
    cardNumber: false,
    expiry: false,
    cvv: false,
  });

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-textMain">
        No plan selected ❌
      </div>
    );
  }

  // ================= COMPUTED ERRORS =================
  const errors = {
    name:
      touched.name && !validators.name.validate(formData.name)
        ? validators.name.message(formData.name)
        : "",
    cardNumber:
      touched.cardNumber && !validators.cardNumber.validate(formData.cardNumber)
        ? validators.cardNumber.message(formData.cardNumber)
        : "",
    expiry:
      touched.expiry && !validators.expiry.validate(formData.expiry)
        ? validators.expiry.message(formData.expiry)
        : "",
    cvv:
      touched.cvv && !validators.cvv.validate(formData.cvv)
        ? validators.cvv.message(formData.cvv)
        : "",
  };

  const isFormValid = Object.keys(validators).every((k) =>
    validators[k].validate(formData[k])
  );

  // ================= FORMATTERS =================
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(" ") || digits;
  };

  const formatExpiry = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + "/" + v.slice(2);
    return v;
  };

  // ================= FIELD CHANGE HANDLER =================
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Mark as touched on first change
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    // Mark all fields as touched to show all errors
    setTouched({ name: true, cardNumber: true, expiry: true, cvv: true });

    if (!isFormValid) {
      setGlobalError("Please fix the errors above before continuing.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        if (examId) {
          navigate(`/takeexam/${examId}`);
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    }, 1500);
  };

  // ================= INPUT CLASS HELPER =================
  const inputClass = (field) =>
    `w-full p-4 pr-10 rounded-xl border bg-bg transition-colors ${
      touched[field]
        ? validators[field].validate(formData[field])
          ? "border-success"
          : "border-danger"
        : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-10">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10">

        {/* LEFT - PLAN */}
        <div data-aos="fade-right"
          className="bg-card border border-border rounded-3xl p-10 shadow-soft">
          <h2 className="text-2xl font-bold text-textMain mb-6">Your Plan</h2>
          <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20">
            <h3 className="text-xl font-semibold text-primary">{plan.title}</h3>
            <p className="text-3xl font-bold mt-3 text-textMain">{plan.price}</p>
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-textSoft mb-2">Included Features:</p>
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-textSoft text-sm"
                  data-aos="fade-up" data-aos-delay={i * 100}>
                  <FaCheckCircle className="text-primary mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div data-aos="fade-left"
          className="bg-card border border-border rounded-3xl p-10 shadow-soft">
          <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-3">
            <FaCreditCard className="text-primary" />
            Payment Details
          </h2>

          {/* GLOBAL ERROR */}
          {globalError && (
            <div className="bg-danger/10 text-danger border border-danger/30 p-4 rounded-xl mb-4 flex items-center gap-2 animate-in">
              <FaExclamationCircle />
              {globalError}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="bg-success/10 text-success border border-success/30 p-4 rounded-xl mb-4 flex items-center justify-center gap-2">
              <FaCheckCircle className="animate-bounce" />
              Payment successful 🎉 Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* NAME */}
            <Field label="Cardholder Name" error={errors.name} touched={touched.name}>
              <div className="relative">
                <input
                  placeholder="Ahmed Mohamed"
                  className={inputClass("name")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                />
                {touched.name && (
                  validators.name.validate(formData.name)
                    ? <FaCheckCircle className="absolute right-3 top-4 text-success" />
                    : <FaExclamationCircle className="absolute right-3 top-4 text-danger" />
                )}
              </div>
            </Field>

            {/* CARD NUMBER */}
            <Field label="Card Number" error={errors.cardNumber} touched={touched.cardNumber}>
              <div className="relative">
                <input
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  className={inputClass("cardNumber")}
                  onChange={(e) => handleChange("cardNumber", formatCardNumber(e.target.value))}
                  onBlur={() => handleBlur("cardNumber")}
                />
                {touched.cardNumber && (
                  validators.cardNumber.validate(formData.cardNumber)
                    ? <FaCheckCircle className="absolute right-3 top-4 text-success" />
                    : <FaExclamationCircle className="absolute right-3 top-4 text-danger" />
                )}
              </div>
            </Field>

            {/* EXPIRY + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry Date" error={errors.expiry} touched={touched.expiry}>
                <div className="relative">
                  <input
                    placeholder="MM/YY"
                    value={formData.expiry}
                    className={inputClass("expiry")}
                    onChange={(e) => handleChange("expiry", formatExpiry(e.target.value))}
                    onBlur={() => handleBlur("expiry")}
                  />
                  {touched.expiry && (
                    validators.expiry.validate(formData.expiry)
                      ? <FaCheckCircle className="absolute right-3 top-4 text-success" />
                      : <FaExclamationCircle className="absolute right-3 top-4 text-danger" />
                  )}
                </div>
              </Field>

              <Field label="CVV" error={errors.cvv} touched={touched.cvv}>
                <div className="relative">
                  <input
                    placeholder="123"
                    value={formData.cvv}
                    className={inputClass("cvv")}
                    onChange={(e) => handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    onBlur={() => handleBlur("cvv")}
                  />
                  {touched.cvv && (
                    validators.cvv.validate(formData.cvv)
                      ? <FaCheckCircle className="absolute right-3 top-4 text-success" />
                      : <FaExclamationCircle className="absolute right-3 top-4 text-danger" />
                  )}
                </div>
              </Field>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primaryLight transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <FaCheckCircle />
                  Payment Successful!
                </>
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}