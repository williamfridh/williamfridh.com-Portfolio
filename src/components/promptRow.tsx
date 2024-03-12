import React, { ReactNode } from 'react';
import Prompt from '../components/prompt';
import Header from '../components/header';
import Navigation from '../components/navigation';



interface Props {
    content: String,
    key: number
}



const PromptRow: React.FC<Props> = ({ content, key }) => {
    return (
        <div className='text-amber-400 leading-normal px-4 py-1' key={key}>
            <span className='font-bold mr-2'>{key}&gt;</span>
            {content}
        </div>
    );
};



export default PromptRow;

