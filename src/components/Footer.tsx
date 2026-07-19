import { CONTENT } from "../constants";
import Magnetic from "./Magnetic";

const Footer = () => {
    const navLinks = [
        "Home", "Projects", "Resume"
    ];

    return (
        <footer className="w-full mt-20 pt-10 pb-6 border-t border-md-outline/10 bg-gradient-to-b from-transparent to-md-surface/30 relative">
            <div className="mx-auto max-w-2xl px-4">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
                    {/* NAVIGATE Section */}
                    <div className="flex-1">
                        <h3 className="text-[11px] font-medium tracking-widest text-md-on-surface-variant mb-4 uppercase">
                            Navigate
                        </h3>
                        <div className="flex flex-wrap gap-x-5 gap-y-3.5 sm:gap-x-7 sm:gap-y-4 max-w-[380px]">
                            {navLinks.map((link) => (
                                <a 
                                    key={link} 
                                    href="#"
                                    className="text-sm sm:text-[15px] text-md-on-surface-variant hover:text-md-on-background transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* CONNECT Section */}
                    <div>
                        <h3 className="text-[11px] font-medium tracking-widest text-md-on-surface-variant mb-4 uppercase">
                            Connect
                        </h3>
                        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                            {CONTENT.social.map((social) => {
                                const Icon = social.icon;
                                return (
                                <Magnetic key={social.name} strength={0.3}>
                                    <a
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 flex items-center justify-center rounded-[14px] border border-md-outline/20 hover:bg-md-surface-variant text-md-on-surface-variant hover:text-md-on-background transition-colors group"
                                        aria-label={`Follow on ${social.name}`}
                                        title={social.name}
                                    >
                                        <Icon size={18} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                                    </a>
                                </Magnetic>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-md-outline/15 text-sm sm:text-[15px] text-md-on-surface-variant/80">
                    <p>&copy; {new Date().getFullYear()} {CONTENT.name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
