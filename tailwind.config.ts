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
      width: {
        '5.4': '1.35rem',
      },
      height: {
        '5.4': '1.35rem',
      },
      padding: {
        '1.2': '0.30rem',
      },
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
            dark: "#2E1A08",
          },
          development: {
            light: "#E7F3FF",
            dark: "#0E1A29",
          },
          design: {
            light: "#EDF9EE",
            dark: "#0F1C13",
          },
        },
        task: {
          blue: {
            light: "#e8f0ff",
            dark: "#1b2733",
          },
          green: {
            light: "#edf9ee",
            dark: "#0f1c13",
          },
          yellow: {
            light: "#fff9db",
            dark: "#332f1b",
          },
          purple: {
            light: "#f2e8ff",
            dark: "#271b33",
          },
        },
        modal: {
          button: {
            DEFAULT: "#FFFFFF",
            dark: "#1f1f1f",
            border: {
              DEFAULT: "#E5E7EB",
              dark: "rgb(40 40 40)",
            },
            text: {
              DEFAULT: "#374151",
              dark: "#f0f0f0",
            },
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
  safelist: [
    // Task colors - light mode
    'bg-task-blue-light',
    'bg-task-green-light',
    'bg-task-yellow-light',
    'bg-task-purple-light',
    // Task colors - dark mode
    'dark:bg-task-blue-dark',
    'dark:bg-task-green-dark',
    'dark:bg-task-yellow-dark',
    'dark:bg-task-purple-dark',
    // Text colors for dark mode
    'dark:text-white',
    'dark:text-gray-100',
    'dark:text-gray-200',
    'dark:text-gray-300',
    'dark:text-gray-400',
  ],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;