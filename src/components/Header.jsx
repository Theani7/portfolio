import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { CONTENT } from "../constants";
import { Menu, X } from "lucide-react";
import SocialLinks from "./SocialLinks";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const formatDate = () => {
            setCurrentDate(
                new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            );
        };
        formatDate();
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-40 bg-[#F9F9F7] border-b-4 border-[#111111]">
            {/* Edition Metadata Bar */}
            <div className="border-b border-[#111111]">
                <div className="mx-auto max-w-screen-xl px-4 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        Vol. 1 &middot; {currentDate} &middot; Kathmandu Edition
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hidden sm:block">
                        All the News That&apos;s Fit to Print
                    </span>
                </div>
            </div>

            {/* Masthead */}
            <div className="mx-auto max-w-screen-xl px-4 py-4 md:py-6">
                <div className="flex items-end justify-between">
                    <Link to="/" className="group">
                        <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9] text-[#111111]">
                            {CONTENT.name.split(' ')[0]}
                            <span className="text-[#CC0000]"> {CONTENT.name.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-1">
                            ML Engineer &middot; AI & Data Science
                        </p>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `nav-item px-4 py-2 text-xs font-sans font-semibold uppercase tracking-widest transition-colors duration-200 ${isActive ? "text-[#CC0000] border-b-2 border-[#CC0000]" : "text-[#111111] hover:text-[#CC0000]"}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/projects"
                            className={({ isActive }) =>
                                `nav-item px-4 py-2 text-xs font-sans font-semibold uppercase tracking-widest transition-colors duration-200 ${isActive ? "text-[#CC0000] border-b-2 border-[#CC0000]" : "text-[#111111] hover:text-[#CC0000]"}`
                            }
                        >
                            Projects
                        </NavLink>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] transition-all duration-200"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-[#111111] bg-[#F9F9F7]">
                    <nav className="mx-auto max-w-screen-xl px-4 py-6 flex flex-col gap-4" aria-label="Mobile navigation">
                        <NavLink
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-sm font-sans font-semibold uppercase tracking-widest py-2 border-b border-[#E5E5E0] transition-colors duration-200 ${isActive ? "text-[#CC0000]" : "text-[#111111]"}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/projects"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-sm font-sans font-semibold uppercase tracking-widest py-2 border-b border-[#E5E5E0] transition-colors duration-200 ${isActive ? "text-[#CC0000]" : "text-[#111111]"}`
                            }
                        >
                            Projects
                        </NavLink>
                        <div className="pt-4 border-t border-[#111111]">
                            <h3 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">Connect</h3>
                            <SocialLinks iconSize={20} />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
