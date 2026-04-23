import { useState } from "react";
import { MdEmail } from "react-icons/md";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthAlert from "../components/auth/AuthAlert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/forgot_password/", {
         method: "POST",
         headers: {
          "Content-Type": "application/json",
    },
         body: JSON.stringify({ email }),
  });
      const data = await response.json();
       if (!response.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setSuccess("If this email exists, a reset link was sent 📩");
  } catch (err) {
    setLoading(false);
    setError("Server error. Try again later");
  }
    };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-center text-textMain mb-2">
        Forgot Password
      </h2>

      <p className="text-center text-textSoft mb-6 text-sm">
        Enter your email to receive reset link
      </p>

      <AuthAlert type="error" message={error} />
      <AuthAlert type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-5">

        <AuthInput
          icon={<MdEmail />}
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primaryLight transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </form>
    </AuthLayout>
  );
}