import React, { ReactNode } from 'react';
import Prompt from '../components/prompt';
import Header from '../components/header';
import Navigation from '../components/navigation';
import { GeneralSettings, MenuItem } from '../shared/interfaces';



/**
 * File specific interfaces and types.
 */
interface Props {
    children: ReactNode;
    generalSettings: GeneralSettings;
    menuItems: MenuItem[];
}



/**
 * Element.
 */
const Layout: React.FC<Props> = ({ children, generalSettings, menuItems }) => {
    return (
        <div>
            <Prompt />
            <main className='bg-neutral-700 h-screen fixed w-3/4 right-0 p-8 overflow-scroll'>
                <Header generalSettings={generalSettings} />
                <Navigation menuItems={menuItems} />
                {children}
            </main>
        </div>
    );
}
export default Layout;

