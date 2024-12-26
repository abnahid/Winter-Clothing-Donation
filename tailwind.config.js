/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        secondary: "#FF7E47",
        DarkGray: "#333333",
        BgColor: "#F7FAFC",
        BtnHover: "#3A76C1",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4A90E2",
        },
      },
    ],
  },
};
