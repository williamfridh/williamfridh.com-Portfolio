import { MenuItem } from '@/shared/interfaces'
import NavigationButton from './navigationButton'

interface Props {
	menuItems: MenuItem[]
}

const Navigation: React.FC<Props> = ({ menuItems }) => {
	return (
		<nav className='mt-2'>
			{menuItems.map(({label, uri}, key) => {
				const newUri = uri === '/' ? '/home' : uri
				return <NavigationButton uri={newUri} label={label} key={key} />
			})}
		</nav>
	)
}
export default Navigation

