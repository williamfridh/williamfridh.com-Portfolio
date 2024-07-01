import { createContext } from 'react';

// Define the context shape
interface GrainEffectContextType {
	grainEffect: boolean;
	setGrainEffect: (value: boolean) => void;
}

// Create the context with an undefined default value
const GrainEffectContext = createContext<GrainEffectContextType | undefined>(undefined);

export default GrainEffectContext

