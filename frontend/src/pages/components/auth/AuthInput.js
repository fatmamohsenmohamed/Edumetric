export default function AuthInput({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-textSoft">
        {icon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 w-full pl-10 px-4 py-3 rounded-xl 
        bg-bg border border-border text-textMain 
        placeholder-textSoft
        focus:outline-none focus:ring-2 focus:ring-primary/30 
        hover:border-primary/40 transition"
      />
    </div>
  );
}