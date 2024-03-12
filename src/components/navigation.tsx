import Link from 'next/link';



interface PageNode {
	title: string;
	uri: string;
}

interface Props {
	pageList: PageNode[];
}



const Navigation: React.FC<Props> = ({ pageList }) => {
	return (
		<header>
			<Link href='/'>Home</Link>
			{pageList.map(({uri, title}, key) => (
				<Link href={uri} key={key}>{title}</Link>
			))}
		</header>
	);
}



export default Navigation;

