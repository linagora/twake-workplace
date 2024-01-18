import formsPlugin from "@tailwindcss/forms"

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'coolgray': '#EDEEF0',
				'coolgray-400': '#818C99',
				'disabled': 'rgba(28, 27, 31, 0.12)',
				'disabled-text': '#1C1B1F',
				'primary': '#0A84FF',
				'error': '#FF3347',
				'blueGray': '#8C9CAF',
				'inputOutline': '#AEAEC0'
			},
			backgroundImage: {
				'layout': 'url("/bubble-dynamic-clay.svg"), url("/lock-dynamic-clay.png")'
			},
			backgroundPosition: {
				'layout': 'top left 600px, left 100px bottom -140px'
			},
			backgroundSize: {
				'layout': 'auto, 20%'
			},
			zIndex: {
				"-1": "-1"
			},
			transformOrigin: {
				"0": "0%"
			}
		}
	},
	plugins: [
		formsPlugin({
			strategy: 'class'
		}),
	],
};
