import type { Config } from "tailwindcss";

const config: Config = {
	content: [
	"./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
	"./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
	"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
	"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				prompt: ["VT323", "monospace"],
			},
			fontSize: {
				'zero': '0px'
			}
		},
	},
	plugins: [],
};
export default config;

