import React from 'react';
import { Project } from '../shared/interfaces';
import Link from 'next/link';
import Image from 'next/image'



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
	console.log(WP_URL);
	return (
		<div>
			{projectList.map(project => (
				<Link href={project.uri}>
					<div>
						{project.image !== null && <Image
							src={WP_URL + project.image}
							alt={`Picture showing the project ${project.title}`}
							width={200}
							height={200}
						/>}
						<h3 className='text-2xl text-amber-400'>{project.title}</h3>
						<h4 className='text-xl text-amber-400'>{project.role}</h4>
						<p>{project.techStack}</p>
					</div>
				</Link>
			))}
		</div>
	);
};
export default Portfolio;

