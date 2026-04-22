export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl p-6 shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}