module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
    extend: {
      fontFamily: {
        'sora': ['Sora', 'sans-serif'] 
      },
    },
  },
	// Add some basic Tailwind plugins to add additional features:
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms'),
	],
};
