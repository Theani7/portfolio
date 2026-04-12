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
        // Initial set
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Kathmandu'
            }));
        };

        updateTime();

        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="w-full border-t-4 border-[#111111] bg-[#111111] text-[#F9F9F7]">
            {/* CTA Section (non-home pages only) */}
            {!isHome && (
                <div className="border-b border-neutral-700 px-4 py-8">
                    <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-4">
                        <a
                            href={emailLink}
                            className="tap-feedback inline-flex items-center bg-[#F9F9F7] text-[#111111] px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-transparent hover:text-[#F9F9F7] border border-transparent hover:border-[#F9F9F7]"
                            aria-label="Hire me via email"
                        >
                            Hire Me
                        </a>
                        <a
                            href={linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tap-feedback inline-flex items-center border border-[#F9F9F7] px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest text-[#F9F9F7] transition-all duration-200 hover:bg-[#F9F9F7] hover:text-[#111111]"
                            aria-label="Book a call via LinkedIn"
                        >
                            Book a Call
                        </a>
                    </div>
                </div>
            )}

            {/* Main Footer Content */}
            <div className="max-w-screen-xl mx-auto px-4 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <span className="font-serif text-2xl font-bold">
                        {CONTENT.name.split(' ')[0]}<span className="text-[#CC0000]"> {CONTENT.name.split(' ').slice(1).join(' ')}</span>
                    </span>
                    <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">
                        {time} · Kathmandu, Nepal
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {CONTENT.social.map((link) => {
                        const Icon = link.icon;
                        return (
                            <a
                                key={link.name}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 flex items-center justify-center border border-neutral-600 text-neutral-400 hover:bg-[#F9F9F7] hover:text-[#111111] hover:border-[#F9F9F7] transition-all duration-200"
                                aria-label={link.name}
                            >
                                <Icon size={20} strokeWidth={1.5} />
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-neutral-700">
                <div className="max-w-screen-xl mx-auto px-4 py-6 text-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                        &copy; {new Date().getFullYear()} {CONTENT.name}. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
