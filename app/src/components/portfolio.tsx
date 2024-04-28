import React from 'react';
import { Project } from '../shared/interfaces';
import Link from 'next/link';
import Date from './date';
import BadgeList from './BadgeList';
import Button from './button';

interface Props {
	projectList: Project[];
}

const Portfolio: React.FC<Props> = ({ projectList }) => {

	const timePeriodFormatting = (project: Project) => {
		return (<><Date dateString={project.start} />{
			project.end === null ? ` - Ongoing` :
				project.start.slice(0, 4) !== project.end.slice(0, 4) &&
				` - ${project.end.slice(0, 4)}`
		}</>)
	}

	return (
		<div className={`
			sm:grid
			sm:grid-cols-[min-content_auto]
			sm:gap-y-4
			`}>
			{projectList.map((project, key) => (
				<div className='contents'>
					<div className={`
						border-r-4
						border-amber-400
						sm:col-span-1
						mr-4
						hidden
						sm:block
						`}>
						<h4>{timePeriodFormatting(project)}</h4>
					</div>
					<div className={`
						sm:col-span-1
						border-amber-400
						border-l-4
						sm:border-0
						mb-4
						sm:mb-0
						`}>
						<h3 className={`flex justify-between`}><>{project.title}</><span className={`sm:hidden`}>{timePeriodFormatting(project)}</span></h3>
						<div className={`pl-4 sm:pl-0`}>
							<p>{project.summary}</p>
							<BadgeList badgeList={project.techStack} />
							<Link href={project.uri} className='mt-2 block'><Button label={`Read more`} /></Link>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
export default Portfolio;

