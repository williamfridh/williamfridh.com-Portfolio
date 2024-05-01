
interface Props {
    label:  string;
}

const Button: React.FC<Props> = ({ label }) => {
    return (
        <div
            className={`
                inline-block
                text-amber-400
                px-2
                w-fit
                border-2
                border-amber-400
                border-solid
                xl:hover:bg-amber-400
                xl:hover:text-neutral-800
            `}
        >
            <span className='text-xl md:text-2xl'>{label} &gt;&gt;</span>
        </div>
    );
}
export default Button;

