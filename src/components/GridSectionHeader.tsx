import { ReactNode } from "react";

interface GridSectionHeaderProps {
    title: string;
    rightContent?: ReactNode;
    className?: string;
}

const GridSectionHeader = ({ title, rightContent, className = "" }: GridSectionHeaderProps) => {
    return (
        <div className={`w-full relative py-3 mb-6 ${className}`}>
            {/* Top horizontal grid line */}
            <div className="grid-line-h top-0" />
            <div className="grid-intersection top-0 -left-6 -translate-x-1/2 -translate-y-1/2 hidden sm:block" />
            <div className="grid-intersection top-0 -right-6 translate-x-1/2 -translate-y-1/2 hidden sm:block" />
            
            {/* Header Content */}
            <div className="flex items-center justify-between">
                <header className="font-display text-2xl sm:text-3xl text-md-on-background">
                    {title}
                </header>
                {rightContent}
            </div>

            {/* Bottom horizontal grid line */}
            <div className="grid-line-h bottom-0" />
            <div className="grid-intersection bottom-0 -left-6 -translate-x-1/2 translate-y-1/2 hidden sm:block" />
            <div className="grid-intersection bottom-0 -right-6 translate-x-1/2 translate-y-1/2 hidden sm:block" />
        </div>
    );
};

export default GridSectionHeader;
