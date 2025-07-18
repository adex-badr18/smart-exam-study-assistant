const Spinner = ({
    secondaryText,
    spinnerSize = "w-6 h-6",
    textClass = "",
    borderClass = "border-white",
}) => {
    return (
        <div className="flex justify-center gap-4">
            <div
                className={`${spinnerSize} rounded-full animate-spin border-y-4 border-solid ${borderClass} border-t-transparent shadow-md`}
            ></div>
            {secondaryText && (
                <span className={`${textClass}`}>{secondaryText}</span>
            )}
        </div>
    );
};

export default Spinner;
