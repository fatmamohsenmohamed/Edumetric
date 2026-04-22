/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",
        primaryLight: "#1e40af",

        bg: "#ffffff",
        card: "#f8fafc",

        textMain: "#0f172a",
        textSoft: "#64748b",

        border: "#e2e8f0",

        success: "#10b981",
        warning: "#f97316",
        danger: "#dc2626",
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },

      boxShadow: {
        soft: "0 8px 20px rgba(30, 58, 138, 0.08)",
      },
    },
  },
  plugins: [],
};

