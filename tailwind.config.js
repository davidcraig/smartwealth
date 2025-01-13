module.exports = {
  content: [
    './pages/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './Components/*.{js,ts,jsx,tsx}',
    './Components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: {
      dark: {
        1: "hsl(0, 0%, 95%);",
        2: "hsl(0, 0%, 90%);",
        3: "hsl(0, 0%, 80%);"
      }
    },
    extend: {}
  },
  plugins: []
}
