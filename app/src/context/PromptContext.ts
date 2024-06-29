import { Branch, promptObj } from '@/shared/interfaces';
import { createContext } from 'react';

// Define the interface for the context.
interface PromptContextType {
	showPrompt: boolean;
	setShowPrompt: (value: boolean) => void;
	layoutReady: boolean;
	setLayoutReady: (value: boolean) => void;

	branch: Branch;
	setBranch: (value: Branch) => void;
	promptInput: string;
	setPromptInput: (value: string) => void;
	folder: string;
	setFolder: (value: string) => void;
	promptArr: promptObj[];
	setPromptArr: (value: promptObj[]) => void;
	promptArrIndex: number;
	setPromptArrIndex: (value: number) => void;
	program: string;
	setProgram: (value: string) => void;
	programData: string;
	setProgramData: (value: string) => void;
}

// Create the context with an undefined default value.
const PromptContext = createContext<PromptContextType | undefined>(undefined);

export default PromptContext;

