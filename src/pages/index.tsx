import React from 'react';
import Layout from '../components/layout';
import 'tailwindcss/tailwind.css';
import { getGeneralSettings, getPageList } from '../lib/api';
import { GetStaticProps } from 'next';



interface GeneralSettings {
	title: string;
	description: string;
}

interface Page {
    node: PageNode
}

interface PageNode {
	title: string;
	uri: string;
}

interface HomeProps {
    generalSettings: GeneralSettings;
    pageList: PageNode[];
}



const Home: React.FC<HomeProps> = ({ generalSettings, pageList }) => {
    return (
        <Layout generalSettings={generalSettings} pageList={pageList}>
            Welcome to Home!
        </Layout>
    );
};
export default Home;



export const getStaticProps = (async () => {
	const generalSettings = await getGeneralSettings();
	const pageList: Page[] = await getPageList();
	return {
		props: {
			generalSettings,
            pageList: pageList.map(node => ({
                title: node.node.title,
                uri: node.node.uri
            }))
		},
	};
}) satisfies GetStaticProps<{
	generalSettings: GeneralSettings
}>

