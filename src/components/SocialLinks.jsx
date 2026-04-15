import { CONTENT } from "../constants";

const SocialLinks = ({ className = "", iconSize = 20 }) => {
    return (
        <div className={`flex gap-3 ${className}`}>
            {CONTENT.social.map(link => {
                const Icon = link.icon;
                return (
                    <a
                        key={link.name}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-md-surface-variant text-md-on-surface-variant transition-all duration-200 hover:bg-md-primary/10 hover:text-md-primary active:scale-95"
                        aria-label={link.name}
                    >
                        <Icon size={iconSize} strokeWidth={1.5} />
                    </a>
                );
            })}
        </div>
    );
};

export default SocialLinks;
