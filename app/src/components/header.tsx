import React from 'react';
import { GeneralSettings } from '../shared/interfaces';
import Image from 'next/image'

interface Props {
  generalSettings: GeneralSettings;
}

const Header: React.FC<Props> = ({ generalSettings: { title, description } }) => {
    return (
        <header className='flex pt-8'>
            <div className='size-20 md:size-[6.5rem] lg:size-36 mr-4'>
                <Image
                    src='/images/headshot.jpg'
                    alt='William Fridh, a fullstack developer.'
                    width={200}
                    height={200}
                />
            </div>
            <div>
                <h1>{title}</h1>
                <h5 className='mt-5 md:mt-4'>{description}</h5>
            </div>
        </header>
    );
};
export default Header;

