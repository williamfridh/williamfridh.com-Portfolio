import React from 'react';
import { promptObj } from '../shared/interfaces';



/**
 * File specific interfaces and types.
 */
interface Props {
    content:        promptObj
    index:          number
}



/**
 * Element.
 * 
 * The prompt row component is used to display the command prompt
 */
const PromptRow: React.FC<Props> = ({ content, index }) => {
    return (
        <div className='text-amber-400 leading-normal px-4 py-1 tracking-wider text-base'>
            <span className='font-bold mr-2'>~{content.folder}$</span>
            {content.command}
            <div dangerouslySetInnerHTML={{ __html: content.result }}></div>
        </div>
    );
};
export default PromptRow;

