import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import Magnetic from "./Magnetic";
import CommandPalette from "./CommandPalette";

const Header = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [isDark, setIsDark] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDark = (e) => {
        const isCurrentlyDark = isDark;

        if (!document.startViewTransition) {
            setIsDark(!isCurrentlyDark);
            return;
        }

        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            setIsDark(!isCurrentlyDark);
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            
            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = searchOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [searchOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === "Escape") setSearchOpen(false);

            const target = e.target;
            const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
            
            if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
                if (e.key.toLowerCase() === 'd') setIsDark(true);
                if (e.key.toLowerCase() === 'l') setIsDark(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Command palette logic is now handled in CommandPalette.jsx

    return (
        <>
            <header className="sticky top-0 z-40 pt-4 pb-2">
                {/* Soft blur gradient background when scrolled */}
                <div 
                    className={`absolute inset-0 -bottom-8 pointer-events-none transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                    }}
                />
                <div 
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-md-background ${isScrolled ? 'opacity-0' : 'opacity-100'}`} 
                />

                <div className="relative z-10 mx-auto max-w-2xl px-4 flex items-center justify-between">
                    
                    <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main">
                        <NavLink to="/" className={({ isActive }) => `text-[15px] transition-colors px-3 py-1 ${isActive ? "text-md-on-background font-bold uppercase" : "text-md-on-surface-variant hover:text-md-on-background font-medium"}`}>Home</NavLink>
                        <NavLink to="/projects" className={({ isActive }) => `text-[15px] transition-colors px-3 py-1 ${isActive ? "text-md-on-background font-bold uppercase" : "text-md-on-surface-variant hover:text-md-on-background font-medium"}`}>Projects</NavLink>
                        <NavLink to="/resume" className={({ isActive }) => `text-[15px] transition-colors px-3 py-1 ${isActive ? "text-md-on-background font-bold uppercase" : "text-md-on-surface-variant hover:text-md-on-background font-medium"}`}>Resume</NavLink>
                        <NavLink to="/setup" className={({ isActive }) => `text-[15px] transition-colors px-3 py-1 ${isActive ? "text-md-on-background font-bold uppercase" : "text-md-on-surface-variant hover:text-md-on-background font-medium"}`}>Setup</NavLink>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Magnetic strength={0.15}>
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-md-outline/30 bg-md-surface text-md-on-surface-variant text-[13px] transition hover:border-md-outline shadow-sm"
                                aria-label="Open search"
                            >
                                <Search size={14} />
                                <span className="opacity-70">⌘</span>
                                <span className="opacity-70">K</span>
                            </button>
                        </Magnetic>
                        
                        <Magnetic strength={0.3}>
                            <button 
                                type="button"
                                onClick={toggleDark}
                                className="relative group p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                aria-label="Toggle theme (Press D or L)"
                            >
                                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-md-surface-variant text-md-on-surface-variant text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-md-outline/30 pointer-events-none shadow-sm z-50">
                                    Theme (D / L)
                                </span>
                                {isDark ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-md-on-surface-variant">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-md-on-surface-variant">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                )}
                            </button>
                        </Magnetic>
                    </div>
                </div>
            </header>

            <CommandPalette 
                open={searchOpen} 
                setOpen={setSearchOpen} 
                isDark={isDark} 
                toggleDark={toggleDark} 
            />
        </>
    );
};

export default Header;