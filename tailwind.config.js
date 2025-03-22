/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B00",
        secondary: "#4CAF50",
        success: "#4CAF50",
        danger: "#FF3B30",
        warning: "#FF9500",
        info: "#5856D6",
        light: "#FFFFFF",
        dark: "#1C1C1E",
      },
    },
  },
  plugins: [],
}; 