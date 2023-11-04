/** @type {import('tailwindcss').Config} */

const ika_theme = {
  text: "#FFFFFF",
  background: "#000000",
  primary: "#45a6ff",
  secondary: "#08324b",
  accent: "#f4fc0e",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: ika_theme,
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
  daisyui: {
    themes: [
      {
        ika_theme,
      },
    ],
  },
  plugins: [require("daisyui")],
};
