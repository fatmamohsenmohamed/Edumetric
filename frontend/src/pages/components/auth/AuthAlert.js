export default function AuthAlert({ type, message }) {
  if (!message) return null;

  return (
    <div
      className={`text-sm p-3 rounded-xl mb-4 text-center animate-fadeIn border ${
        type === "error"
          ? "bg-danger/10 text-danger border-danger/30"
          : "bg-success/10 text-success border-success/30"
      }`}
    >
      {message}
    </div>
  );
}