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
		<header>
			<Link href='/'>Home</Link>
			{pageList.map(({slug, title}, key) => (
				<Link href={'/' + slug} key={key}>{title}</Link>
			))}
		</header>
	);
}
export default Navigation;

