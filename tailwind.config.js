/*eslint-disable */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			spacing: {
				26: ' 6.5rem',
				18: '4.5rem',
				22: '5.5rem',
			},

			colors: {
				nollu: {
					100: '#F2F2F2',
				},
			},
		},
	},
	plugins: [],
}
