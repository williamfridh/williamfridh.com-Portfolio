import { getGeneralSettings, getProject, getMenuItems, getSocialMedia, getProjectSlugs } from '../../lib/api';
import { GeneralSettings, Project, MenuItem } from '../../shared/interfaces';
import { GetStaticProps } from 'next';
import Layout from '../../components/layout';
import Image from 'next/image'
import BadgeList from '@/components/BadgeList';
import Button from '@/components/button';
import Link from 'next/link';

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

interface ProjectProps {
    generalSettings:    GeneralSettings;
    menuItems:          MenuItem[];
	project:            Project;
    socialMedia:        MenuItem[];
}

const ProjectPage: React.FC<ProjectProps> = ({ generalSettings, project, menuItems, socialMedia }) => {
    console.log(project);
    return (
        <Layout generalSettings={generalSettings} menuItems={menuItems} socialMedia={socialMedia}>
            <div className='content'>
                <h2 dangerouslySetInnerHTML={{ __html: project.title }} className='mt-8'></h2>
                <Image
                    src={WP_URL + project.image}
                    alt={`Picture showing the project ${project.title}`}
                    width={768}
                    height={1280}
                    className='border-amber-400 border-t-4'
                    />
                    <div className='*:mr-2 *:mt-2 *:inline-block'>
                        {project.github && <Link href={project.github} target='_blank'><Button label='View on GitHub' /></Link>}
                        {project.link && <Link href={project.link} target='_blank'><Button label='View live version' /></Link>}
                    </div>
                <BadgeList badgeList={project.techStack} />
                <p><b>{project.summary}</b></p>
                {project.content && <div dangerouslySetInnerHTML={{__html: project.content }}></div>}
            </div>
        </Layout>
    );
};
export default ProjectPage;

export const getStaticPaths = (async () => {
    const slugList = await getProjectSlugs();
    return {
        paths:      slugList,
        fallback:   false, // Set to true if you want to enable fallback behavior
    };
})

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

