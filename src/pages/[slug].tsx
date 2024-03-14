import React from 'react';
import Layout from '../components/layout';
import 'tailwindcss/tailwind.css';
import { getGeneralSettings, getPageSlugs, getPage } from '../lib/api';
import { PageNode, GeneralSettings } from '../shared/interfaces';
import { GetStaticProps } from 'next';



/**
 * File specific interfaces and types.
 */
interface HomeProps {
    generalSettings: GeneralSettings;
    pageList: PageNode[];
}



/**
 * Element.
 */
const Home: React.FC<HomeProps> = ({ generalSettings, pageList }) => {
    return (
        <Layout generalSettings={generalSettings} pageList={pageList}>
            Welcome to Home!
        </Layout>
    );
};
export default Home;



/**
 * Get Static Paths.
 */
export const getStaticPaths = (async () => {
    const slugList = await getPageSlugs();
    return {
        paths: slugList,
        fallback: false, // Set to true if you want to enable fallback behavior
    };
})



/**
 * Get Static Props.
 */
export const getStaticProps: GetStaticProps = (async ({ params }) => {
    let slug: string = '';
    if (params && typeof params.slug === 'string') {
        slug = params.slug;
    }
    console.log("Slug: " + slug);
    const page = await getPage(slug);
	const generalSettings = await getGeneralSettings();
	return {
		props: {
			generalSettings,
            page
		},
	};
})

