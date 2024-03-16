import { parseISO, format } from 'date-fns';
import React from 'react';



/**
 * File specific interfaces and types.
 */
interface Props {
	dateString: string;
}



/**
 * Element.
 * 
 * Souce: https://nextjs.org/learn-pages-router/basics/dynamic-routes/polishing-post-page
 */
const Date: React.FC<Props> = ({ dateString }) => {
	const date = parseISO(dateString);
	return <time dateTime={dateString}>{format(date, 'yyyy')}</time>;
}
export default Date;

