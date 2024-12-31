/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF", // Color de fondo secundario

        veryPaleBlue: "#f5f6ff",
        shadowColor: "#755bce",
        textPrimary: "#0b0b0c", // Color de texto principal
        textSecondary: "#755bce", // Color de texto secundario
        moderateBlue: "#755bce",
        white: "#ffffff",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
