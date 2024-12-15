import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#34C759",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E8E8ED",
          foreground: "#1D1D1F",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#34C759",
          foreground: "#FFFFFF",
        },
        calendar: {
          marketing: {
            light: "#FEF3E0",
            dark: "rgba(46, 26, 8, 0.3)",
          },
          development: {
            light: "#E7F3FF",
            dark: "rgba(14, 26, 41, 0.3)",
          },
          design: {
            light: "#EDF9EE",
            dark: "rgba(15, 28, 19, 0.3)",
          },
        },
        task: {
          yellow: {
            light: "#FEF9C3",
            dark: "rgba(59, 52, 4, 0.3)",
          },
          green: {
            light: "#D1FAE5",
            dark: "rgba(14, 28, 17, 0.3)",
          },
          pink: {
            light: "#FCE7F3",
            dark: "rgba(46, 12, 27, 0.3)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;