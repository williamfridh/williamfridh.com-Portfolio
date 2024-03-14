import React from 'react';
import { GeneralSettings } from '../shared/interfaces';



/**
 * File specific interfaces and types.
 */
interface Props {
  generalSettings: GeneralSettings;
}



/**
 * Element.
 */
const Header: React.FC<Props> = ({ generalSettings }) => {
	return (
		<header>
			<h1 className='text-8xl bg-amber-400 text-neutral-800 px-4'>{generalSettings.title}</h1>
			<h5 className='text-2xl bg-amber-400 text-neutral-800 px-4 mt-1'>{generalSettings.description}</h5>
		</header>
	);
};
export default Header;

