export function Card({ children, className = "" , onClick}) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl p-6 shadow-soft ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}