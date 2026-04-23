export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-lg">
        <div className="bg-card border border-border shadow-soft rounded-3xl p-10 animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}