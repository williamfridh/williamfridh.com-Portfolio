import PromptContext from '@/context/PromptContext';
import { useContext } from 'react';

const usePrompt = () => {
    const context = useContext(PromptContext);
    if (context === undefined) {
        throw new Error('usePromptContext must be used within a LayoutProvider');
    }
    return context;
}

export default usePrompt;

