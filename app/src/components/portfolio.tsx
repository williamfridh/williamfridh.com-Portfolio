import React from 'react';
import { Project } from '@/shared/interfaces';
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
			grid
			w-full
			min-w-0
			grid-cols-1
			sm:grid-cols-[min-content_minmax(0,1fr)]
			gap-y-8
			sm:gap-y-16
			mt-8
			sm:mt-16
			`}>
			{projectList.map((project, key) => (
				<div className='contents' key={key}>
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
						min-w-0
						w-full
						border-amber-400
						border-l-4
						sm:border-0
						mb-4
						sm:mb-0
						`}>
						<h3 className={`flex w-full min-w-0 items-start justify-between gap-4`}>
							<span className={`min-w-0`}>{project.title}</span>
							<span className={`shrink-0 sm:hidden`}>{timePeriodFormatting(project)}</span>
						</h3>
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

