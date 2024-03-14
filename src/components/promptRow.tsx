import React from 'react';
import { promptObj } from '../shared/interfaces';



/**
 * File specific interfaces and types.
 */
interface Props {
    content: promptObj,
    index: number
}



/**
 * Element.
 */
const PromptRow: React.FC<Props> = ({ content, index }) => {
    console.log(index);
    return (
        <div className='text-amber-400 leading-normal px-4 py-1 tracking-wider text-xl'>
            <span className='font-bold mr-2'>{index + 1} &gt;</span>
            {content.command}
            <div dangerouslySetInnerHTML={{ __html: content.result }}></div>
        </div>
    );
};
export default PromptRow;

