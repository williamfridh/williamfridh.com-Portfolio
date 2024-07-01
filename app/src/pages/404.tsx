import Button from '@/components/button';
import Link from 'next/link';
import React from 'react';

interface Props {
}

const Custom404: React.FC<Props> = () => {
    return (
        <div className='
            bg-neutral-700
            '>
            {<div className={`grain-effect`}></div>}
            <div className='
                grid
                h-screen
                w-full
                content-center
                justify-center
            '>
                <h1 className='
                    w-full
                '>404</h1>
                <p className='
                    text-nowrap
                '>Page not found.</p>
                <Link href='/'><Button label='Go to home page' /></Link>
            </div>
        </div>
    );
};
export default Custom404;

