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
