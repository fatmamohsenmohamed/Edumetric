import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCreditCard, FaCheckCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const plan = location.state?.plan;

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // ================= VALIDATION =================
  const isNameValid = formData.name.trim().length > 2;
  const isCardValid = /^[0-9]{16}$/.test(formData.cardNumber);
  const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry);
  const isCvvValid = /^[0-9]{3,4}$/.test(formData.cvv);

  const isFormValid =
    isNameValid && isCardValid && isExpiryValid && isCvvValid;

  // ================= FORMATTERS =================
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").slice(0, 16);

  const formatExpiry = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + "/" + v.slice(2);
    return v;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Please complete all fields correctly");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/api/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          plan_id: plan.id,
          ...formData,
        }),
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        setError(data.error || "Payment failed ❌");
        return;
      }

      setSuccess("Payment successful 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-10">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10">

        {/* LEFT - PLAN */}
        <div
          data-aos="fade-right"
          className="bg-card border border-border rounded-3xl p-10 shadow-soft"
        >
          <h2 className="text-2xl font-bold text-textMain mb-6">
            Your Plan
          </h2>

          <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20">

            <h3 className="text-xl font-semibold text-primary">
              {plan.title}
            </h3>

            <p className="text-3xl font-bold mt-3 text-textMain">
              {plan.price}
            </p>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-textSoft mb-2">
                Included Features:
              </p>

              {plan.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-textSoft text-sm"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <FaCheckCircle className="text-primary mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div
          data-aos="fade-left"
          className="bg-card border border-border rounded-3xl p-10 shadow-soft"
        >

          <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-3">
            <FaCreditCard className="text-primary" />
            Payment Details
          </h2>

          {/* ERROR */}
          {error && (
            <div className="bg-danger/10 text-danger border border-danger/30 p-4 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="bg-success/10 text-success border border-success/30 p-4 rounded-xl mb-4 flex items-center justify-center gap-2">
              <FaCheckCircle className="animate-bounce" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div className="relative">
              <input
                placeholder="Cardholder Name"
                className="w-full p-4 pr-10 rounded-xl border border-border bg-bg"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {isNameValid && (
                <FaCheckCircle className="absolute right-3 top-4 text-green-500 animate-pulse" />
              )}
            </div>

            {/* CARD */}
            <div className="relative">
              <input
                placeholder="Card Number"
                value={formData.cardNumber}
                className="w-full p-4 pr-10 rounded-xl border border-border bg-bg"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
              />

              {isCardValid && (
                <FaCheckCircle className="absolute right-3 top-4 text-green-500 animate-pulse" />
              )}
            </div>

            {/* EXPIRY + CVV */}
            <div className="grid grid-cols-2 gap-4">

              <div className="relative">
                <input
                  placeholder="MM/YY"
                  value={formData.expiry}
                  className="p-4 w-full pr-10 rounded-xl border border-border bg-bg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiry: formatExpiry(e.target.value),
                    })
                  }
                />

                {isExpiryValid && (
                  <FaCheckCircle className="absolute right-3 top-4 text-green-500 animate-pulse" />
                )}
              </div>

              <div className="relative">
                <input
                  placeholder="CVV"
                  value={formData.cvv}
                  className="p-4 w-full pr-10 rounded-xl border border-border bg-bg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cvv: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />

                {isCvvValid && (
                  <FaCheckCircle className="absolute right-3 top-4 text-green-500 animate-pulse" />
                )}
              </div>

            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primaryLight transition disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}