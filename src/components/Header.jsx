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
        <header className="sticky top-0 z-40 bg-md-background/80 backdrop-blur-md border-b border-md-outline/20">
            {/* Top Bar */}
            <div className="bg-md-surface">
                <div className="mx-auto max-w-screen-xl px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-md-on-surface-variant">
                        {currentDate}
                    </span>
                    <span className="text-xs font-medium text-md-primary hidden sm:block">
                        ML Engineer & AI Developer
                    </span>
                </div>
            </div>

            {/* Main Header */}
            <div className="mx-auto max-w-screen-xl px-4 py-4 md:py-5">
                <div className="flex items-center justify-between">
                    <Link to="/" className="group">
                        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-md-on-background">
                            {CONTENT.name.split(' ')[0]}
                            <span className="text-md-primary"> {CONTENT.name.split(' ').slice(1).join(' ')}</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${isActive ? "bg-md-primary text-md-on-primary" : "text-md-on-background hover:bg-md-primary/10"}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/projects"
                            className={({ isActive }) =>
                                `px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${isActive ? "bg-md-primary text-md-on-primary" : "text-md-on-background hover:bg-md-primary/10"}`
                            }
                        >
                            Projects
                        </NavLink>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-md-surface text-md-on-background hover:bg-md-primary/10 transition-all duration-200 active:scale-95"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-md-surface rounded-b-3xl mx-4 mb-4 shadow-lg">
                    <nav className="px-4 py-4 flex flex-col gap-2" aria-label="Mobile navigation">
                        <NavLink
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${isActive ? "bg-md-primary text-md-on-primary" : "text-md-on-background hover:bg-md-primary/10"}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/projects"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${isActive ? "bg-md-primary text-md-on-primary" : "text-md-on-background hover:bg-md-primary/10"}`
                            }
                        >
                            Projects
                        </NavLink>
                        <div className="pt-2 mt-2 border-t border-md-outline/20">
                            <h3 className="text-xs font-medium text-md-on-surface-variant mb-3 px-2">Connect</h3>
                            <SocialLinks iconSize={20} />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
