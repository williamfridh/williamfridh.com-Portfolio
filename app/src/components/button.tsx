
interface Props {
    label:  string;
}

const Button: React.FC<Props> = ({ label }) => {
    return (
        <div
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
            <span className='text-2xl md:text-4xl'>{label}</span>
        </div>
    );
}
export default Button;

