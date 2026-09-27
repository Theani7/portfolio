interface GridDividerProps {
    className?: string;
}

const GridDivider = ({ className = "" }: GridDividerProps) => {
    return (
        <div className={`w-full relative my-8 py-1 ${className}`} aria-hidden="true">
            <div className="grid-line-h top-1/2 -translate-y-1/2" />
            <div className="grid-intersection top-1/2 -left-6 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
            <div className="grid-intersection top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 hidden sm:block" />
        </div>
    );
};

export default GridDivider;
