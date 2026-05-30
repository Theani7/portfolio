import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { CONTENT } from "../constants";
import { Menu, X } from "lucide-react";
import SocialLinks from "./SocialLinks";

const navItem = ({ isActive }) =>
    `mono py-1 transition-colors ${isActive ? "text-md-on-background" : "text-md-on-surface-variant hover:text-md-on-background"}`;

const Header = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [open]);

    return (
        <header className="sticky top-0 z-40 bg-md-background/85 backdrop-blur-sm border-b border-md-outline">
            <div className="mx-auto max-w-screen-xl px-4 md:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="font-display text-xl font-semibold tracking-tight text-md-on-background">
                    {CONTENT.name}<span className="text-accent">.</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
                    <NavLink to="/" className={navItem}>Home</NavLink>
                    <NavLink to="/projects" className={navItem}>Projects</NavLink>
                    <span className="h-4 w-px bg-md-outline" />
                    <SocialLinks iconSize={17} />
                </nav>

                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-md-outline text-md-on-background active:scale-95 transition"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {open && (
                <div className="md:hidden border-t border-md-outline bg-md-background">
                    <nav className="px-4 py-5 flex flex-col gap-4" aria-label="Mobile navigation">
                        <NavLink to="/" onClick={() => setOpen(false)} className={navItem}>Home</NavLink>
                        <NavLink to="/projects" onClick={() => setOpen(false)} className={navItem}>Projects</NavLink>
                        <div className="pt-4 mt-1 border-t border-md-outline">
                            <p className="mono text-md-on-surface-variant mb-3">Connect</p>
                            <SocialLinks iconSize={20} />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
