import { AppProps } from 'next/app';
import '@/styles/globals.css';
import GrainEffectContext from '@/context/GrainEffectContext';
import { useEffect, useState } from 'react';
import PromptContext from '@/context/PromptContext';
import useWindowDimensions from '@/hooks/useWindowDimensions';



/**
 * Element.
 * 
 * The App component is used to wrap the entire application.
 * It's used to pass global props to all pages.
 */
const App: React.FC<AppProps> = ({ Component, pageProps }) => {

    const { width, height } 					= useWindowDimensions()
	const [grainEffect, setGrainEffect] 		= useState(true);
	const [showPrompt, setShowPrompt] 			= useState(false);
	const [layoutReady, setLayoutReady] 		= useState(false);

    /**
     * Set data upon activation.
     * 
     * Hide the prompt as default if none large scren
     * is detected.
     */
    useEffect(() => {
		if (width && width >= Number(process.env.NEXT_PUBLIC_WP_LARGE_SCREEN_WIDTH_THRESHHOLD))
			setShowPrompt(true);
		setTimeout(() => {
			setLayoutReady(true);
		}, 10);
    }, [])

	return(
		<>
			<PromptContext.Provider value={{ showPrompt, setShowPrompt, layoutReady, setLayoutReady }}>
				<GrainEffectContext.Provider value={{ grainEffect, setGrainEffect }}>
					<Component {...pageProps} />
				</GrainEffectContext.Provider>
			</PromptContext.Provider>
		</>
	);
};
export default App;

