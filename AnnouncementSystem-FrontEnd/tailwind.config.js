/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          backgroundColor: '#3B78C2',
          borderColor: '#3B78C2',
          color: 'white',
          padding: '0.60rem 1.1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          fontSize: '0.8rem',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#5BA6F2',
          },
          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            backgroundColor: '#3B78C2',
          },
        },
      });
    },
  ],
}
