import Link from 'next/link';
import { MenuItem } from '../shared/interfaces';



/**
 * File specific interfaces and types.
 */
interface Props {
	menuItems: MenuItem[];
}



/**
 * Element.
 */
const Navigation: React.FC<Props> = ({ menuItems }) => {
	return (
		<nav className='mt-2'>
			{menuItems.map(({label, order, uri}, key) => (
				<Link 
					href={uri}
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
					<span className='text-xs mr-2'>■</span><span>{label}</span>
				</Link>
			))}
		</nav>
	);
}
export default Navigation;

