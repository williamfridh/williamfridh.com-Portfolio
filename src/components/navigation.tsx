import Link from 'next/link';
import { PageNode } from '../shared/interfaces';



/**
 * File specific interfaces and types.
 */
interface Props {
	pageList: PageNode[];
}



/**
 * Element.
 */
const Navigation: React.FC<Props> = ({ pageList }) => {
	return (
		<nav className='mt-2'>
			{pageList.map(({slug, title}, key) => (
				<Link 
					href={'/' + slug}
					key={key}
					className='
					text-amber-400
					text-3xl
					flex
					items-center
					px-2
					w-fit
					hover:bg-amber-400
					hover:text-neutral-800
				'>
					<span className='text-xs mr-2'>■</span><span>{title}</span>
				</Link>
			))}
		</nav>
	);
}
export default Navigation;

