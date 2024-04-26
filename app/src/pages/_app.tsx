import { AppProps } from 'next/app';
import '../styles/globals.css';



/**
 * Element.
 * 
 * The App component is used to wrap the entire application.
 * It's used to pass global props to all pages.
 */
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};
export default App;

