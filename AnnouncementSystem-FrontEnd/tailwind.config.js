/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-gray': '#D9D9D9', // Cor já definida
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.main-layout': {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f1f5f9', // bg-slate-100
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        },
        '.main-content': {
          width: '100%',
          maxWidth: '768px',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem',
          marginBottom: '2rem',
        },
        '.main-section': {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          lineHeight: '1.25',
          width: '287px',
        },
      });
    },
  ],
}
