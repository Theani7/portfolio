import { CONTENT } from "../constants";

const SocialLinks = ({ className = "", iconSize = 18 }) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            {CONTENT.social.map(link => {
                const Icon = link.icon;
                return (
                    <a
                        key={link.name}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-md-outline text-md-on-surface-variant transition-colors duration-200 hover:border-md-on-background hover:text-md-on-background"
                        aria-label={link.name}
                    >
                        <Icon size={iconSize} strokeWidth={1.6} />
                    </a>
                );
            })}
        </div>
    );
};

export default SocialLinks;
