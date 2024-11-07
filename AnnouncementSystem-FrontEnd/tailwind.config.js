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
        '.btn-primary': {
          backgroundColor: '#1E3A8A',  // bg-blue-900
          borderColor: '#1E3A8A', // border color same as background
          color: 'white',
          padding: '0.60rem 1.1rem', // p-3
          borderRadius: '0.5rem', // rounded-lg
          display: 'flex',
          gap: '0.5rem', // gap-2
          alignItems: 'center', // self-stretch
          justifyContent: 'center', // center content inside
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#2563EB', // hover:bg-blue-700
          },
          '&:focus': {
            outline: 'none', // remove default focus outline
          },
          '&:active': {
            backgroundColor: '#1D4ED8', // active state, darker shade
          },
        },
      });
    },
  ],
}
