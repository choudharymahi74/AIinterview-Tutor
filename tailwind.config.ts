import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'SF Mono', 'Consolas', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "hsl(221, 83%, 95%)",
          100: "hsl(221, 83%, 90%)",
          200: "hsl(221, 83%, 80%)",
          300: "hsl(221, 83%, 70%)",
          400: "hsl(221, 83%, 60%)",
          500: "var(--primary)",
          600: "hsl(221, 83%, 45%)",
          700: "hsl(221, 83%, 35%)",
          800: "hsl(221, 83%, 25%)",
          900: "hsl(221, 83%, 15%)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "hsl(263, 83%, 95%)",
          100: "hsl(263, 83%, 90%)",
          200: "hsl(263, 83%, 80%)",
          300: "hsl(263, 83%, 70%)",
          400: "hsl(263, 83%, 60%)",
          500: "var(--secondary)",
          600: "hsl(263, 83%, 45%)",
          700: "hsl(263, 83%, 35%)",
          800: "hsl(263, 83%, 25%)",
          900: "hsl(263, 83%, 15%)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        blue: {
          50: "hsl(214, 100%, 97%)",
          100: "hsl(214, 95%, 93%)",
          200: "hsl(213, 97%, 87%)",
          300: "hsl(212, 96%, 78%)",
          400: "hsl(213, 94%, 68%)",
          500: "hsl(217, 91%, 60%)",
          600: "hsl(221, 83%, 53%)",
          700: "hsl(224, 76%, 48%)",
          800: "hsl(226, 71%, 40%)",
          900: "hsl(224, 64%, 33%)",
        },
        slate: {
          50: "hsl(210, 40%, 98%)",
          100: "hsl(210, 40%, 96%)",
          200: "hsl(214, 32%, 91%)",
          300: "hsl(213, 27%, 84%)",
          400: "hsl(215, 20%, 65%)",
          500: "hsl(215, 16%, 47%)",
          600: "hsl(215, 19%, 35%)",
          700: "hsl(215, 25%, 27%)",
          800: "hsl(217, 33%, 17%)",
          900: "hsl(222, 84%, 4.9%)",
        },
        green: {
          400: "hsl(142, 76%, 36%)",
          500: "hsl(142, 71%, 45%)",
          600: "hsl(142, 69%, 58%)",
        },
        yellow: {
          400: "hsl(54, 91%, 95%)",
          500: "hsl(45, 93%, 47%)",
          600: "hsl(25, 95%, 53%)",
        },
        red: {
          400: "hsl(0, 84%, 60%)",
          500: "hsl(0, 72%, 51%)",
          600: "hsl(0, 65%, 48%)",
        },
        purple: {
          400: "hsl(263, 70%, 50%)",
          500: "hsl(263, 83%, 57%)",
          600: "hsl(263, 83%, 45%)",
        },
        orange: {
          500: "hsl(25, 95%, 53%)",
          600: "hsl(21, 90%, 48%)",
        },
        cyan: {
          500: "hsl(188, 94%, 43%)",
          600: "hsl(188, 86%, 53%)",
        },
        pink: {
          500: "hsl(330, 81%, 60%)",
          600: "hsl(330, 81%, 67%)",
        },
        emerald: {
          600: "hsl(160, 84%, 39%)",
        },
        rose: {
          600: "hsl(346, 77%, 49%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "shimmer": {
          "0%": {
            "background-position": "-200% 0",
          },
          "100%": {
            "background-position": "200% 0",
          },
        },
        "voice-pulse": {
          "0%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1.4)",
            opacity: "0",
          },
        },
        "recording-pulse": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite",
        "voice-pulse": "voice-pulse 1.5s ease-in-out infinite",
        "recording-pulse": "recording-pulse 1s ease-in-out infinite",
      },
      boxShadow: {
        "glow": "0 0 20px rgb(59 130 246 / 0.5)",
        "glow-lg": "0 0 30px rgb(59 130 246 / 0.6)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
