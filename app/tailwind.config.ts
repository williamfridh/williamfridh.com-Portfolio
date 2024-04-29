import type { Config } from "tailwindcss";

// Temporary fix for known issue with tailwind-scrollbar plugin.
// SRC: https://javascript.plainenglish.io/typescript-cannot-find-name-require-8e327dde6363
declare var require: any;

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
    plugins: [
        require('tailwind-scrollbar')({ preferredStrategy: 'pseudoelements' }),  // default: 'standard'
    ],
};
export default config;

