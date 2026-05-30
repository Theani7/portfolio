import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SocialLinks from "./SocialLinks";
import { CONTENT } from "../constants";

const Footer = () => {
    const [time, setTime] = useState("");
    const location = useLocation();
    const isHome = location.pathname === "/";
    const emailLink = CONTENT.social.find((item) => item.name === "Email")?.link || "mailto:theanilpaneru@gmail.com";
    const linkedInLink = CONTENT.social.find((item) => item.name === "LinkedIn")?.link || "https://www.linkedin.com";

    useEffect(() => {
        const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kathmandu" }));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="w-full border-t border-md-outline mt-16">
            <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                {!isHome && (
                    <div className="py-10 border-b border-md-outline flex flex-wrap items-center gap-3">
                        <a href={emailLink} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm min-h-[46px]" aria-label="Hire me via email">
                            Hire Me <ArrowRight size={16} />
                        </a>
                        <a href={linkedInLink} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center px-6 py-3 text-sm min-h-[46px]" aria-label="Book a call via LinkedIn">
                            Book a Call
                        </a>
                    </div>
                )}

                <div className="py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <span className="font-display text-lg font-semibold text-md-on-background">
                            {CONTENT.name}<span className="text-accent">.</span>
                        </span>
                        <p className="mono text-md-on-surface-variant mt-2">{time} · Kathmandu, Nepal</p>
                    </div>
                    <SocialLinks />
                </div>

                <div className="border-t border-md-outline py-6 text-center">
                    <span className="mono text-md-on-surface-variant">
                        &copy; {new Date().getFullYear()} {CONTENT.name} — All rights reserved
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
