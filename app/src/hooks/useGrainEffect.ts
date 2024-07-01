import GrainEffectContext from '@/context/GrainEffectContext';
import { useContext } from 'react';

const useGrainEffect = () => {
    const context = useContext(GrainEffectContext);
    if (context === undefined) {
        throw new Error('useGrainEffectContext must be used within a GrainEffectProvider');
    }
    return context;
}

export default useGrainEffect;

