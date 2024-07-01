interface Props {
    label: string;
    value: boolean;
    handler: (value: boolean) => void;
}

const ToggleInput: React.FC<Props> = ({ label, value, handler }) => {

    const handleChange = () => {
        handler(!value)
    }

    return (
        <div
            className={`
                inline-flex
                items-center
                justify-between
                space-x-2
                cursor-pointer
            `}
            >
            <label
                className={`
                    text-amber-400
                    text-xl
                    `}
                >{label}</label>
            <div
                onClick={handleChange}
                className={`
                    w-12
                    h-6
                    bg-gray-400
                    relative
                    `}
                >{/* Background. */}
                <div
                    className={`
                        w-6
                        h-6
                        transform
                        duration-300
                        ease-in-out
                        absolute
                        ${value ? `translate-x-6 bg-amber-400` : `translate-x-0 bg-amber-800`}
                        `}
                    ></div>{/* Toggle. */}
            </div>
        </div>
    )
}
export default ToggleInput;

