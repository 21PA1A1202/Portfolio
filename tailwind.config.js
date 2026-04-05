// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        arcblue: '#00f0ff',
        darkbg: '#0a0f1a',
      },
      fontFamily: {
        tech: ['Orbitron', 'sans-serif'],
      },
    keyframes: {
  typewriter: {
    '0%': { width: '0ch' },
    '100%': { width: '26ch' }, // exact number of characters
  },
  blink: {
    '0%, 100%': { borderColor: 'transparent' },
    '50%': { borderColor: '#00f0ff' },
  },
  zoomToO: {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(30) translateX(-1.65rem)' },
  }
},
animation: {
  typewriter: 'typewriter 3s steps(26) 1s 1 normal both',
  blink: 'blink 1s step-end infinite',
  zoomToO: 'zoomToO 1s ease-in-out forwards',
}


    },
  },
  plugins: [],
}
