export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-5 py-2 rounded-xl font-medium transition-all duration-200";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primaryLight shadow-soft",
    outline:
      "border border-border text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/10",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}