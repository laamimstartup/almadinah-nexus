import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Islamic Futurism Palette
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#C9A84C",
          600: "#b8963e",
          700: "#92742e",
          800: "#78601f",
          900: "#5a4718",
        },
        emerald: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        nexus: {
          bg:      "#0A0E1A",
          surface: "#111827",
          card:    "#161D2F",
          border:  "#1E2A42",
          muted:   "#374151",
          subtle:  "#4B5563",
        },
      },
      fontFamily: {
        sans:    ["var(--font-instrument)", "Inter", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        arabic:  ["var(--font-arabic)", "Amiri", "serif"],
      },
      backgroundImage: {
        "mashrabiya": "url('/patterns/mashrabiya.svg')",
        "gradient-nexus": "linear-gradient(135deg, #0A0E1A 0%, #0d1526 50%, #0A0E1A 100%)",
        "gradient-gold":  "linear-gradient(135deg, #C9A84C 0%, #fbbf24 50%, #C9A84C 100%)",
        "gradient-emerald": "linear-gradient(135deg, #065f46 0%, #059669 100%)",
        "glow-gold": "radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)",
        "glow-emerald": "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glass":      "0 8px 32px 0 rgba(0,0,0,0.37)",
        "gold-glow":  "0 0 30px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.1)",
        "emerald-glow": "0 0 30px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.1)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.1)",
      },
      animation: {
        "float":        "float 6s ease-in-out infinite",
        "pulse-slow":   "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer":      "shimmer 2s linear infinite",
        "constellation":"constellation 8s ease-in-out infinite",
        "rotate-slow":  "spin 20s linear infinite",
        "fade-in-up":   "fadeInUp 0.6s ease-out",
        "fade-in":      "fadeIn 0.4s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        constellation: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%":      { opacity: "1",   transform: "scale(1.05)" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
