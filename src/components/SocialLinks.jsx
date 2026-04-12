import { CONTENT } from "../constants";

const SocialLinks = ({ className = "", iconSize = 18, variant = "default" }) => {
    const isInverted = variant === "inverted";

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
                        className={`inline-flex items-center justify-center border h-10 w-10 transition-all duration-200 ${
                            isInverted
                                ? "border-neutral-600 text-neutral-400 hover:bg-[#F9F9F7] hover:text-[#111111] hover:border-[#F9F9F7]"
                                : "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]"
                        }`}
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
