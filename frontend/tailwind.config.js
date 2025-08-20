/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(226 232 240)",
        input: "rgb(226 232 240)", 
        ring: "rgb(59 130 246)",
        background: "rgb(255 255 255)",
        foreground: "rgb(15 23 42)",
        primary: {
          DEFAULT: "rgb(59 130 246)",
          foreground: "rgb(248 250 252)",
        },
        secondary: {
          DEFAULT: "rgb(241 245 249)",
          foreground: "rgb(15 23 42)",
        },
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(248 250 252)",
        },
        muted: {
          DEFAULT: "rgb(241 245 249)",
          foreground: "rgb(100 116 139)",
        },
        accent: {
          DEFAULT: "rgb(241 245 249)",
          foreground: "rgb(15 23 42)",
        },
        popover: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(15 23 42)",
        },
        card: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(15 23 42)",
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
