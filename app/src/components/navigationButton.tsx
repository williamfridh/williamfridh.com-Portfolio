import Link from 'next/link';

interface Props {
    uri:        string;
    label:      string;
    target?:    string;
}

const NavigationButton: React.FC<Props> = ({ uri, label, target }) => {
    return (
        <Link
            href={uri}
            {...(target && { target })}
            className={`
                text-amber-400
                flex
                items-center
                px-2
                w-fit
                hover:bg-amber-400
                hover:text-neutral-800
            `}
        >
            <span className='text-xs md:text-xl mr-2'>■</span><span className='text-2xl md:text-4xl'>{label}</span>
        </Link>
    );
}
export default NavigationButton;

