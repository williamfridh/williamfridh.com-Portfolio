import React from 'react';
import Layout from '../components/layout';
import 'tailwindcss/tailwind.css';
import { getGeneralSettings, getPageSlugs, getPage, getProjects, getMenuItems, getSocialMedia } from '../lib/api';
import { GeneralSettings, PageData, Project, MenuItem } from '../shared/interfaces';
import { GetStaticProps } from 'next';
import Portfolio from '../components/portfolio';



/**
 * File specific interfaces and types.
 */
interface Props {
    generalSettings: GeneralSettings;
    menuItems: MenuItem[];
	page: PageData;
    projectList: Project[];
    socialMedia: MenuItem[];
}



/**
 * Element.
 */
const Page: React.FC<Props> = ({ generalSettings, page, projectList, menuItems, socialMedia }) => {
    return (
        <Layout generalSettings={generalSettings} menuItems={menuItems} socialMedia={socialMedia}>
            <h2 dangerouslySetInnerHTML={{ __html: page.title }} className='bg-amber-400 text-5xl text-neutral-800 px-4 mt-8'></h2>
            <div dangerouslySetInnerHTML={{ __html: page.content }} className='text-amber-400 text-2xl my-4  space-y-4'></div>
            {page.displayPortfolioElement === true && 
                <Portfolio projectList={projectList} />
            }
        </Layout>
    );
};
export default Page;



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

    const page = await getPage(slug);
	const generalSettings = await getGeneralSettings();
    const projectList = await getProjects();
    const menuItems = await getMenuItems();
    const socialMedia = await getSocialMedia();
    
	return {
		props: {
			generalSettings,
            page,
            projectList,
            menuItems,
            socialMedia
		},
	};
})

