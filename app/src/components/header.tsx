import React from 'react';
import { GeneralSettings } from '@/shared/interfaces';
import Image from 'next/image'
import Head from 'next/head';
import ToggleInput from './toggleInput';
import useGrainEffect from '@/hooks/useGrainEffect';

interface Props {
  generalSettings: GeneralSettings;
}

const Header: React.FC<Props> = ({ generalSettings: { title, description, customLogoUrl, siteIconUrl } }) => {

    const { grainEffect, setGrainEffect } = useGrainEffect()

    return (
        <div className='pt-4'>
            <Head>
                <link rel='icon' href={siteIconUrl} />
            </Head>
            <div>
                <ToggleInput label='Grain effect' value={grainEffect} handler={setGrainEffect} />
            </div>
            <header className='flex pt-4'>
                {customLogoUrl && <div className='size-20 md:size-[6.5rem] lg:size-36 mr-4'>
                    <Image
                        src={customLogoUrl}
                        alt={title + ' logo - ' + description}
                        width={200}
                        height={200}
                    />
                </div>}
                <div>
                    <h1>{title}</h1>
                    <h5 className='mt-5 md:mt-4'>{description}</h5>
                </div>
            </header>
        </div>
    );
};
export default Header;

