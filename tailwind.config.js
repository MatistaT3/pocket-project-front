/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        oxfordBlue: "#ffffff", // Color de fondo principal este se va
        background: "##fafbff", // Color de fondo secundario
        teal: "#f5f6ff", // Color de acento primario este se va
        veryPaleBlue: "#f5f6ff",
        shadowColor: "#755bce",
        sand: "#0b0b0c", // Color de texto principal este se va
        textPrimary: "#0b0b0c", // Color de texto principal
        coral: "#755bce", // Color de texto secundario este se va
        textSecondary: "#755bce", // Color de texto secundario
        moderateBlue: "#755bce",
        orange: "#6549c9", // Color de acento secundario este se va
        white: "#ffffff",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
