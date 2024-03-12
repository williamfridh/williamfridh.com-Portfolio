import React, { ReactNode } from 'react';
import Prompt from '../components/prompt';
import Header from '../components/header';
import Navigation from '../components/navigation';



interface GeneralSettings {
    title: string;
    description: string;
}

interface PageNode {
	title: string;
	uri: string;
}

interface LayoutProps {
    children: ReactNode;
    generalSettings: GeneralSettings;
    pageList: PageNode[];
}



const Layout: React.FC<LayoutProps> = ({ children, generalSettings, pageList }) => {
    return (
        <div>
            <Prompt />
            <main className='bg-neutral-700 h-screen fixed w-3/4 right-0 p-8'>
                <Header generalSettings={generalSettings} />
                <Navigation pageList={pageList} />
                {children}
            </main>
        </div>
    );
}
export default Layout;


