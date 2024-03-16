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
 */
const Layout: React.FC<Props> = ({ children, generalSettings, menuItems, socialMedia }) => {

    /**
     * Keep states for special effects and layout here.
     * Remember to to add toggles for the extra features
     * on the APP for those who prefer less distractions.
     */
    const [noiseEffect, setNoiseEffect] = useState(true);

    return (
        <div className={noiseEffect ? `noise-effect` : ``}>
            <Prompt />
            <main className='bg-neutral-700 h-screen fixed w-3/4 right-0 p-8 overflow-scroll overflow-x-hidden'>
                <Header generalSettings={generalSettings} />
                <Navigation menuItems={menuItems} />
                <Social socialMedia={socialMedia} />
                {children}
            </main>
        </div>
    );
}
export default Layout;

