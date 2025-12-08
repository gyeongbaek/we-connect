/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--grayLv2)",
        input: "var(--grayLv2)",
        ring: "var(--primary)",
        background: "var(--background)",
        foreground: "var(--surface)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--white)",
        },
        secondary: {
          DEFAULT: "var(--grayLv1)",
          foreground: "var(--surface)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "var(--white)",
        },
        muted: {
          DEFAULT: "var(--grayLv1)",
          foreground: "var(--grayLv3)",
        },
        accent: {
          DEFAULT: "var(--activation)",
          foreground: "var(--surface)",
        },
        popover: {
          DEFAULT: "var(--background)",
          foreground: "var(--surface)",
        },
        card: {
          DEFAULT: "var(--background)",
          foreground: "var(--surface)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        mono: ["Source Code Pro", "monospace"],
      },
    },
  },
  plugins: [],
}
