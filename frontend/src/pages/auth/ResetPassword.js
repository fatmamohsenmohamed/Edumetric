import { useState } from "react";
import { MdLock } from "react-icons/md";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthAlert from "../components/auth/AuthAlert";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // validation
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reset_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.error || "Invalid or expired link");
        return;
      }

      setSuccess("Password reset successfully 🔥");

      // optional redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError("Server error. Try again later");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-center text-textMain mb-2">
        Reset Password
      </h2>

      <p className="text-center text-textSoft mb-6 text-sm">
        Enter your new password
      </p>

      <AuthAlert type="error" message={error} />
      <AuthAlert type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-5">

        <AuthInput
          icon={<MdLock />}
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthInput
          icon={<MdLock />}
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primaryLight transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>
    </AuthLayout>
  );
}