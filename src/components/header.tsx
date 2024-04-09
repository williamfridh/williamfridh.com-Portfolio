import React from 'react';
import { GeneralSettings } from '../shared/interfaces';
import Image from 'next/image'



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
		<header className='flex pt-8'>
			<div className='size-20 md:size-36 mr-4'>
				<Image
					src='/images/headshot.jpg'
					alt='William Fridh, a fullstack developer.'
					width={200}
					height={200}
					/>
			</div>
			<div>
				<h1>{generalSettings.title}</h1>
				<h5 className='mt-4'>{generalSettings.description}</h5>
			</div>
		</header>
	);
};
export default Header;

