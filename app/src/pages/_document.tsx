import { Html, Head, Main, NextScript } from "next/document";

/**
 * Element.
 * 
 * The Document component is used to wrap the entire application.
 * It's used to pass global props to all pages.
 */
export default function Document() {
	return (
		<Html lang="en">
			<Head />
			<body className='font-prompt'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

