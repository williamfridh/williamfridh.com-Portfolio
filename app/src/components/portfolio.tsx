import React from 'react';
import { Project } from '../shared/interfaces';
import Link from 'next/link';
import Date from './date';
import BadgeList from './BadgeList';
import NavigationButton from './navigationButton';

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
				<div className='contents relative'>
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
						`}>
						<h3 className={`flex justify-between`}><>{project.title}</><span className={`sm:hidden`}>{timePeriodFormatting(project)}</span></h3>
						<div className={`pl-4 sm:pl-0`}>
							<p>{project.summary}</p>
							<NavigationButton uri={project.uri} label='View project' />
							<BadgeList badgeList={project.techStack} />
						</div>
					</div>
					<div className='absolute top-0 right-0 bottom-0 left-0 bg-amber-400 hidden hover:block'></div>
				</div>
			))}
		</div>
	);
};
export default Portfolio;

