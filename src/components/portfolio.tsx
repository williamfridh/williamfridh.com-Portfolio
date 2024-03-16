import React from 'react';
import { Project } from '../shared/interfaces';
import Link from 'next/link';
import Image from 'next/image'
import Date from './date';
import Icon from './icon';



const WP_URL = process.env.NEXT_PUBLIC_WP_URL;



/**
 * File specific interfaces and types.
 */
interface Props {
	projectList: Project[];
}



/**
 * Element.
 */
const Portfolio: React.FC<Props> = ({ projectList }) => {
	return (
		<div className='grid grid-cols-[min-content_auto] gap-y-4 max-w-3xl'>
			{projectList.map((project, key) => (
				<Link href={project.uri} key={key} className='contents'>
					{/*<div className='pl-2 mt-4 flex max-w-3xl'>*/}
						<div className='border-r-4 border-amber-400 text-end col-span-1 mr-4'>
							{project.end === null || project.start.slice(0, 4) === project.end.slice(0, 4)
								? <h4 className='inline-block'><Date dateString={project.start} /></h4>
								: <h4 className='inline-block'><Date dateString={project.start} /> - {project.end != null ? <Date dateString={project.end} /> : `Ongoing`}</h4>}
						</div>
						{/*<div className='col-span-1 mr-2'>
							{project.image !== null && <Image
								src={WP_URL + project.image}
								alt={`Picture showing the project ${project.title}`}
								width={300}
								height={300}
							/>}
							</div>*/}
						<div className='col-span-1'>
							{/* Compare the YEARS */}
							<h3>{project.title}</h3>
							<p>{project.summary}</p>
							<div className='text-zero'>
								{project.techStack.split(/, |,/).sort().map((tech, key) => (
									<span className='inline-block mr-2 mb-2' key={key}>
										<Icon name={tech} />
									</span>
								))}
							</div>
						</div>
					{/*</div>*/}
				</Link>
			))}
		</div>
	);
};
export default Portfolio;

