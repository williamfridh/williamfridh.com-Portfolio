import React from 'react';
import { Project } from '../shared/interfaces';
import Link from 'next/link';
import Image from 'next/image'
import Icon from './icon';
import Date from './date';



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
	console.log(projectList);
	return (
		<div>
			{projectList.map(project => (
				<Link href={project.uri}>
					<div className='border-l-4 border-amber-400 pl-2 mt-4 flex max-w-3xl items-center'>
						<div className='mr-4'>
							{project.image !== null && <Image
								src={WP_URL + project.image}
								alt={`Picture showing the project ${project.title}`}
								width={300}
								height={300}
							/>}
						</div>
						<div>
							{/* Compare the YEARS */}
							<h3 className='text-3xl text-amber-400'>{project.title}</h3>
							{project.start === project.end
								? <h4 className='text-amber-400 text-lg'><Date dateString={project.start} /></h4>
								: <h4 className='text-amber-400 text-lg'><Date dateString={project.start} /> - {project.end != null ? <Date dateString={project.end} /> : `Ongoing`}</h4>}
							<div className='text-zero'>
								{project.techStack.split(/, |,/).sort().map((tech: string) => (
									<span className='inline-block mr-2 mb-2'>
										<Icon name={tech} />
									</span>
								))}
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};
export default Portfolio;

