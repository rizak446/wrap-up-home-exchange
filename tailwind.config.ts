import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // User Requested Palette:
        // 1. MOCHA BROWN: #5B4632
        mocha: {
          50: "#FAF7F4",
          100: "#F4EFE9",
          200: "#E6DCD0",
          300: "#CEBCAB",
          400: "#A8927D",
          500: "#7D634C",
          600: "#5B4632", // Primary Mocha Brown
          700: "#493726",
          800: "#362719",
          900: "#261A10",
          950: "#181008", // Deep espresso
        },
        // 2. CHAMPAGNE GOLD: #F4D9A0
        champagne: {
          50: "#FDFBF7",
          100: "#FAF5EA",
          200: "#F6EBD1",
          300: "#F4D9A0", // Champagne Gold
          400: "#E8C882",
          500: "#D4AF5F",
          600: "#BA9444",
          700: "#927233",
          800: "#765C2B",
          900: "#614B25",
          950: "#382A11",
        },
        // 3. BURNT AMBER: #C8792C
        amber: {
          50: "#FDF9F3",
          100: "#FBEEE1",
          200: "#F6DCC2",
          300: "#EFC39C",
          400: "#DF9E5E",
          500: "#C8792C", // Burnt Amber
          600: "#B46520",
          700: "#914E18",
          800: "#743E16",
          900: "#5E3314",
          950: "#351A07",
        },
        burnt: {
          DEFAULT: "#C8792C",
          light: "#DF9E5E",
          dark: "#914E18",
        },
        brand: {
          mocha: "#5B4632",
          espresso: "#181008",
          champagne: "#F4D9A0",
          champagneSoft: "#FAF5EA",
          burnt: "#C8792C",
          burntDark: "#914E18",
          cream: "#FAF7F2",
        },
        // Harmonize existing legacy classes with the new luxury palette:
        navy: {
          50: "#FAF7F4",
          100: "#F4EFE9",
          200: "#E6DCD0",
          300: "#CEBCAB",
          400: "#A8927D",
          500: "#7D634C",
          600: "#5B4632",
          700: "#493726",
          800: "#362719",
          900: "#261A10",
          950: "#181008",
        },
        teal: {
          50: "#FDF9F3",
          100: "#FBEEE1",
          200: "#F6EBD1",
          300: "#F4D9A0",
          400: "#DF9E5E",
          500: "#C8792C",
          600: "#B46520",
          700: "#914E18",
          800: "#743E16",
          900: "#5E3314",
          950: "#351A07",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(40, 26, 16, 0.04), 0 1px 2px -1px rgba(40, 26, 16, 0.04)",
        card: "0 4px 6px -1px rgba(40, 26, 16, 0.05), 0 2px 4px -2px rgba(40, 26, 16, 0.03)",
        elevated: "0 10px 15px -3px rgba(40, 26, 16, 0.08), 0 4px 6px -4px rgba(40, 26, 16, 0.04)",
        luxury: "0 20px 25px -5px rgba(24, 16, 8, 0.12), 0 8px 10px -6px rgba(24, 16, 8, 0.06)",
        amberGlow: "0 0 25px rgba(200, 121, 44, 0.28)",
        champagneGlow: "0 0 25px rgba(244, 217, 160, 0.35)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        editorial: ["'Cinzel'", "'Playfair Display'", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
