import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import AuthAlert from "./components/auth/AuthAlert";

export default function ConfirmEmail() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token"); // hna dy el token elly gayya mn el email bta3 el user nafso

        if (!token) {
            setError("Invalid confirmation link");
            setLoading(false);
            return;
        }

        fetch("http://127.0.0.1:8000/api/confirm_email/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if (data.error) {
                setError(data.error);
            } else {
                setMessage("Email confirmed successfully! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2500);
            }
        })
        .catch(() => {
            setLoading(false);
            setError("Server error. Try again later");
        });

    }, []);

    return (
        <AuthLayout>
            <h2 className="text-3xl font-bold text-center text-textMain mb-2">
                Email Confirmation
            </h2>

            <p className="text-center text-textSoft mb-6 text-sm">
                Please wait while we confirm your email
            </p>

            {/* Loading spinner */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                    <div style={{
                        width: "44px", height: "44px",
                        border: "4px solid #e5e7eb",
                        borderTop: "4px solid var(--color-primary, #1e3a8a)",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}/>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Success or error message */}
            <AuthAlert type="error" message={error} />
            <AuthAlert type="success" message={message} />

            {/* Button shows only after loading is done */}
            {!loading && error && (
                <Link
                    to="/register"
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-center block mt-4 hover:bg-primaryLight transition"
                >
                    Back to Register
                </Link>
            )}

            {!loading && message && (
                <Link
                    to="/login"
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-center block mt-4 hover:bg-primaryLight transition"
                >
                    Go to Login
                </Link>
            )}
        </AuthLayout>
    );
}