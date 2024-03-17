import React, { ReactNode, useState } from 'react';
import Prompt from '../components/prompt';
import Header from '../components/header';
import Navigation from '../components/navigation';
import { GeneralSettings, MenuItem } from '../shared/interfaces';
import Social from '../components/social';



/**
 * File specific interfaces and types.
 */
interface Props {
    children:           ReactNode;
    generalSettings:    GeneralSettings;
    menuItems:          MenuItem[];
    socialMedia:        MenuItem[];
}



/**
 * Element.
 * 
 * The layout component is the main layout for the application.
 */
const Layout: React.FC<Props> = ({ children, generalSettings, menuItems, socialMedia }) => {

    /**
     * State.
     * 
     * Keep states for special effects and layout here.
     * Remember to to add toggles for the extra features
     * on the APP for those who prefer less distractions.
     */
    const [noiseEffect, setNoiseEffect] = useState(true);
    const [showPrompt, setShowPrompt] = useState(true);

    /**
     * Toggle prompt.
     * 
     * This function is used to toggle the prompt.
     * It's passed to the prompt component.
     */
    const togglePrompt = () => {
        setShowPrompt(!showPrompt);
    }
    
    return (
        <div className={noiseEffect ? `noise-effect` : ``}>
            <Prompt menuItems={menuItems} socialMedia={socialMedia} togglePrompt={togglePrompt} showPrompt={showPrompt} />
            <main className={`
                bg-neutral-700
                h-screen
                fixed
                ${showPrompt ? `w-3/4` : `w-full`}
                right-0
                px-4
                py-8
                overflow-scroll
                overflow-x-hidden
                flex
                place-content-center
                transition-width
                duration-200
                max-w-full
            `}>
                <div className=''>
                    <Header generalSettings={generalSettings} />
                    <Navigation menuItems={menuItems} />
                    <Social socialMedia={socialMedia} />
                    {children}
                </div>
            </main>
        </div>
    );
}
export default Layout;

