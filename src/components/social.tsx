import Link from 'next/link';
import { MenuItem } from '../shared/interfaces';
import Icon from './icon'



/**
 * File specific interfaces and types.
 */
interface Props {
	socialMedia: MenuItem[];
}



/**
 * Element.
 */
const Social: React.FC<Props> = ({ socialMedia }) => {
	return (
		<nav className='mt-2'>
			{socialMedia.map(({label, uri}, key) => (
				<Link 
					href={uri}
					key={key}
					target='_blank'
					className='
						pr-2
						inline-block
						hover:fill-amber-400
					'>
					<Icon name={label} />
				</Link>
			))}
		</nav>
	);
}
export default Social;

