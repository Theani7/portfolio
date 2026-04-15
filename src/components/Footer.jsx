import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import { CONTENT } from "../constants";

const Footer = () => {
    const [time, setTime] = useState("");
    const location = useLocation();
    const isHome = location.pathname === "/";
    const emailLink = CONTENT.social.find((item) => item.name === "Email")?.link || "mailto:theanilpaneru@gmail.com";
    const linkedInLink = CONTENT.social.find((item) => item.name === "LinkedIn")?.link || "https://www.linkedin.com";

    useEffect(() => {
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kathmandu'
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="w-full bg-md-surface mt-16 rounded-t-3xl">
            {/* CTA Section (non-home pages only) */}
            {!isHome && (
                <div className="px-4 py-8 border-b border-md-outline/20">
                    <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-4">
                        <a
                            href={emailLink}
                            className="inline-flex items-center bg-md-primary text-md-on-primary px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:bg-md-primary/90 active:scale-95 shadow-md"
                            aria-label="Hire me via email"
                        >
                            Hire Me
                        </a>
                        <a
                            href={linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center border border-md-outline px-6 py-3 text-sm font-medium rounded-full text-md-primary transition-all duration-200 hover:bg-md-primary/10 active:scale-95"
                            aria-label="Book a call via LinkedIn"
                        >
                            Book a Call
                        </a>
                    </div>
                </div>
            )}

            {/* Main Footer Content */}
            <div className="max-w-screen-xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <span className="text-lg font-medium text-md-on-background">
                        {CONTENT.name.split(' ')[0]}
                        <span className="text-md-primary"> {CONTENT.name.split(' ').slice(1).join(' ')}</span>
                    </span>
                    <p className="text-sm text-md-on-surface-variant mt-1">
                        {time} · Kathmandu, Nepal
                    </p>
                </div>

                <SocialLinks />
            </div>

            {/* Copyright */}
            <div className="border-t border-md-outline/20">
                <div className="max-w-screen-xl mx-auto px-4 py-6 text-center">
                    <span className="text-sm text-md-on-surface-variant">
                        &copy; {new Date().getFullYear()} {CONTENT.name}. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
