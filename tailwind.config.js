/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dream: {
          bg: "#0d051a",
          bgLight: "#1a0a2e",
          primary: "#9d4edd",
          secondary: "#7b2cbf",
          accent: "#ffd700",
          accentSoft: "#ffeb80",
          purpleSoft: "#c77dff",
          blueSoft: "#a0c4ff",
          pinkSoft: "#ffc8dd",
        },
        emotion: {
          happy: "#ffd166",
          sad: "#4cc9f0",
          fear: "#7209b7",
          calm: "#90be6d",
          excited: "#f72585",
          confused: "#f8961e",
          angry: "#d62828",
          peaceful: "#4361ee",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(157, 78, 221, 0.4)",
        glowSoft: "0 0 15px rgba(157, 78, 221, 0.25)",
        glowGold: "0 0 20px rgba(255, 215, 0, 0.4)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "dream-gradient":
          "linear-gradient(135deg, #0d051a 0%, #1a0a2e 50%, #2d1b4e 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
