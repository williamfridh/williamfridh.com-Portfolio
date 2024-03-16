import { getGeneralSettings, getProject, getMenuItems, getSocialMedia, getProjectSlugs } from '../../lib/api';
import { GeneralSettings, Project, MenuItem } from '../../shared/interfaces';
import { GetStaticProps } from 'next';
import Layout from '../../components/layout';



/**
 * File specific interfaces and types.
 */
interface ProjectProps {
    generalSettings:    GeneralSettings;
    menuItems:          MenuItem[];
	project:            Project;
    socialMedia:        MenuItem[];
}



/**
 * Element.
 */
const Project: React.FC<ProjectProps> = ({ generalSettings, project, menuItems, socialMedia }) => {
    return (
        <Layout generalSettings={generalSettings} menuItems={menuItems} socialMedia={socialMedia}>
            <h2 dangerouslySetInnerHTML={{ __html: project.title }} className='mt-8'></h2>
            <p><b>{project.summary}</b></p>
            {project.content && <div dangerouslySetInnerHTML={{__html: project.content }}></div>}
        </Layout>
    );
};
export default Project;



/**
 * Get Static Paths.
 */
export const getStaticPaths = (async () => {
    const slugList = await getProjectSlugs();
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

    const project            = await getProject(slug);
	const generalSettings    = await getGeneralSettings();
    const menuItems          = await getMenuItems();
    const socialMedia        = await getSocialMedia();
    
	return {
		props: {
			generalSettings,
            project,
            menuItems,
            socialMedia
		},
	};
})