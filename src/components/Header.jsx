import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { PROJECTS, SKILLS, CONTENT } from "../constants";
import Magnetic from "./Magnetic";

const navItem = ({ isActive }) =>
    `mono py-1 transition-colors ${isActive ? "text-md-on-background font-bold uppercase" : "text-md-on-surface-variant hover:text-md-on-background font-medium"}`;

const getSlug = (title) => String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Header = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef(null);

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
            // ponytail: Cmd+K / Ctrl+K shortcut
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
                setQuery("");
            }
            if (e.key === "Escape") setSearchOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // ponytail: quick search across projects/skills/social
    const searchResults = query ? {
        projects: PROJECTS.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
        ),
        skills: SKILLS.filter(s => s.name.toLowerCase().includes(query.toLowerCase())),
        social: CONTENT.social.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    } : { projects: [], skills: [], social: [] };

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
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                aria-label="Toggle dark mode"
                            >
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

            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/20 dark:bg-black/60 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-2xl bg-md-surface rounded-3xl border border-md-outline shadow-2xl shadow-black/20 overflow-hidden flex flex-col max-h-[80vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center px-6 py-4 border-b border-md-outline bg-md-surface">
                                <Search size={22} className="text-md-on-surface-variant mr-4" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search everything..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="flex-1 min-w-0 bg-transparent text-md-on-background text-lg md:text-xl font-display focus:outline-none placeholder:text-md-on-surface-variant/50"
                                    autoFocus
                                    autoComplete="off"
                                />
                                <div className="flex gap-2 items-center shrink-0 ml-4">
                                    {query && (
                                        <button onClick={() => setQuery('')} className="p-1.5 rounded-md hover:bg-md-surface-variant text-md-on-surface-variant transition">
                                            <X size={18} />
                                        </button>
                                    )}
                                    <span className="mono text-[10px] sm:text-xs text-md-on-surface-variant px-2 py-1 bg-md-surface-variant rounded-md">ESC</span>
                                </div>
                            </div>
                            
                            <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
                                {!query ? (
                                    <div className="py-16 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-md-surface-variant/50 flex items-center justify-center mb-4 border border-md-outline/30">
                                            <Search size={28} className="text-md-on-surface-variant/70" />
                                        </div>
                                        <p className="text-md-on-background font-medium text-lg">What are you looking for?</p>
                                        <p className="text-sm text-md-on-surface-variant mt-2 max-w-xs">Search through projects, skills, and social links instantly.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {searchResults.projects.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                                                <p className="px-2 text-xs font-bold uppercase tracking-wider text-md-on-surface-variant mb-3 flex items-center gap-2">
                                                    Projects <span className="bg-md-surface-variant px-2 py-0.5 rounded-full text-[10px]">{searchResults.projects.length}</span>
                                                </p>
                                                <div className="space-y-1">
                                                    {searchResults.projects.map(p => (
                                                        <Link 
                                                            key={p.id} 
                                                            to={`/projects/${p.id}-${getSlug(p.title)}`} 
                                                            className="group flex items-start gap-4 p-3 rounded-xl hover:bg-md-surface-variant/80 transition-all duration-200" 
                                                            onClick={() => setSearchOpen(false)}
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-md-background flex items-center justify-center shrink-0 border border-md-outline group-hover:border-accent group-hover:shadow-[0_0_10px_rgba(var(--accent),0.2)] transition-all">
                                                                <span className="font-display font-bold text-accent">{p.title.charAt(0)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-display font-medium text-md-on-background group-hover:text-accent transition-colors block">{p.title}</span>
                                                                <span className="block text-sm text-md-on-surface-variant line-clamp-1 mt-0.5">{p.description}</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                        {searchResults.skills.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                                <p className="px-2 text-xs font-bold uppercase tracking-wider text-md-on-surface-variant mb-3 flex items-center gap-2">
                                                    Skills <span className="bg-md-surface-variant px-2 py-0.5 rounded-full text-[10px]">{searchResults.skills.length}</span>
                                                </p>
                                                <div className="flex flex-wrap gap-2 px-2">
                                                    {searchResults.skills.map(s => (
                                                        <span key={s.name} className="mono text-sm px-3 py-1.5 rounded-lg bg-md-surface-variant/50 text-md-on-background border border-md-outline/50 hover:border-accent hover:bg-accent/10 hover:text-accent transition-colors cursor-default">
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                        {searchResults.social.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                                <p className="px-2 text-xs font-bold uppercase tracking-wider text-md-on-surface-variant mb-3 flex items-center gap-2">
                                                    Social <span className="bg-md-surface-variant px-2 py-0.5 rounded-full text-[10px]">{searchResults.social.length}</span>
                                                </p>
                                                <div className="flex flex-wrap gap-2 px-2">
                                                    {searchResults.social.map(s => (
                                                        <a 
                                                            key={s.name} 
                                                            href={s.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 rounded-lg bg-md-surface-variant/30 hover:bg-md-surface-variant text-md-on-background border border-transparent hover:border-md-outline transition-colors flex items-center gap-2 text-sm font-medium"
                                                        >
                                                            {s.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                        {query && searchResults.projects.length === 0 && searchResults.skills.length === 0 && searchResults.social.length === 0 && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 flex flex-col items-center justify-center text-center">
                                                <p className="text-md-on-background font-medium text-lg">No results found for "{query}"</p>
                                                <p className="text-sm text-md-on-surface-variant mt-2 max-w-xs">We couldn't find anything matching your search. Try adjusting your keywords.</p>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;