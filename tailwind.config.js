/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.tsx', './components/**/*.tsx'],
	theme: {
		extend: {
			colors: {
				primary: '#174080',
			},
			keyframes: {
				emoji: {
					'0%': {
						opacity: '0',
						transform: 'translateY(0) scale(0)',
					},
					'50%': {
						opacity: '1',
						transform: 'translateY(-30px) scale(1)',
					},
					to: {
						opacity: '0',
						transform: 'translateY(-50px) scale(1.5)',
					},
				},
			},
		},
	},
	plugins: [require('daisyui')],
}
