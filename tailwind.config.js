/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Adjust paths based on where your components and pages are located
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}", // If you have a layouts directory
    // Add any other directories or file patterns where Tailwind classes are used
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
