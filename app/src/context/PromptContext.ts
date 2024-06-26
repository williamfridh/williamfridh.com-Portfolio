import { createContext } from 'react';

// Define the context shape
interface PromptContextType {
	showPrompt: boolean;
	setShowPrompt: (value: boolean) => void;
	layoutReady: boolean;
	setLayoutReady: (value: boolean) => void;
}

// Create the context with an undefined default value
const PromptContext = createContext<PromptContextType | undefined>(undefined);

export default PromptContext

