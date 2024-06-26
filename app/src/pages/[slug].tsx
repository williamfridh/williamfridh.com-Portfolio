import Layout from '@/components/layout';
import { getGeneralSettings, getPageSlugs, getPage, getProjects, getMenuItems, getSocialMedia } from '@/lib/api';
import { GeneralSettings, PageData, Project, MenuItem } from '@/shared/interfaces';
import { GetStaticProps } from 'next';
import Portfolio from '@/components/portfolio';
import Head from 'next/head';
import parse from "html-react-parser";

interface Props {
    generalSettings:    GeneralSettings;
    menuItems:          MenuItem[];
	page:               PageData;
    projectList:        Project[];
    socialMedia:        MenuItem[];
}

const Page: React.FC<Props> = ({ generalSettings, page, projectList, menuItems, socialMedia }) => {

    return (
        <>
            <Head>
                <title>{page.seoTitle}</title>
                <meta name='description' content={page.seoMetaDesc} />
                {parse(page.seoFullHead)}
            </Head>
            <Layout generalSettings={generalSettings} menuItems={menuItems} socialMedia={socialMedia}>
                <h2 className='title'><span dangerouslySetInnerHTML={{ __html: page.title }}></span></h2>
                <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
                {page.displayPortfolioElement === true && 
                    <Portfolio projectList={projectList} />
                }
            </Layout>
        </>
    );
};
export default Page;



/**
 * Get Static Paths.
 */
export const getStaticPaths = (async () => {
    const slugList = await getPageSlugs();
    return {
        paths:      slugList,
        fallback:   false, // Set to true if you want to enable fallback behavior
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

    const page               = await getPage(slug);
	const generalSettings    = await getGeneralSettings();
    const projectList        = await getProjects();
    const menuItems          = await getMenuItems();
    const socialMedia        = await getSocialMedia();
    
	return {
		props: {
			generalSettings,
            page,
            projectList,
            menuItems,
            socialMedia
		},
        revalidate: process.env.REVALIDATE_SECONDS ? parseInt(process.env.REVALIDATE_SECONDS) : 1,
	};
})

