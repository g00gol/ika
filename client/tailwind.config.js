/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      text: "#000000",
      background: "#FFFFFF",
      primary: "#45a6ff",
      secondary: "#08324b",
      accent: "#f4fc0e",
    },
    fontSize: {
      sm: "0.750rem",
      base: " 1rem",
      xl: "1.333rem",
      "2xl": "1.777rem",
      "3xl": "2.369rem",
      "4xl": "3.158rem",
      "5xl": "4.210rem",
    },
    fontFamily: {
      heading: "Poppins",
      body: "Poppins",
    },
    fontWeight: {
      normal: "400",
      bold: "700",
    },
  },
  plugins: [],
};
