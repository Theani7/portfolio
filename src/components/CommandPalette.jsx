import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, Home, Folder, FileText, Terminal, Calculator, ExternalLink, Code2, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, SKILLS, CONTENT } from '../constants';
import { playHoverSound, playClickSound } from '../utils/sound';

const getSlug = (title) => String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CommandPalette = ({ open, setOpen, isDark, toggleDark }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const down = (e) => {
            if (e.key?.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(true);
                setQuery("");
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [setOpen]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [open]);

    // Math evaluator for spotlight-like calculation
    let mathResult = null;
    if (/^[0-9+\-*/().\s]+$/.test(query) && /[0-9]/.test(query) && /[+\-*/]/.test(query)) {
        try {
            // eslint-disable-next-line no-new-func
            mathResult = new Function(`return ${query}`)();
            if (!Number.isFinite(mathResult)) mathResult = null;
        } catch (e) {
            mathResult = null;
        }
    }

    const itemClassName = "flex items-center gap-4 p-3 rounded-xl cursor-pointer text-md-on-background hover:bg-md-surface-variant/80 aria-selected:bg-md-surface-variant/80 aria-selected:text-accent transition-colors";
    const groupClassName = "mt-4 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-md-on-surface-variant";

    return (
        <AnimatePresence>
            {open && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 backdrop-blur-md bg-black/20 dark:bg-black/60"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-2xl bg-md-surface rounded-3xl border border-md-outline shadow-2xl shadow-black/20 overflow-hidden flex flex-col max-h-[80vh]"
                        style={{ fontFamily: 'inherit' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Command className="flex flex-col h-full w-full bg-transparent">
                            {/* Header / Input */}
                            <div className="flex items-center px-6 py-4 border-b border-md-outline bg-md-surface shrink-0">
                                <Search size={22} className="text-md-on-surface-variant mr-4" />
                                <Command.Input 
                                    autoFocus
                                    value={query}
                                    onValueChange={setQuery}
                                    placeholder="Search apps, projects, skills, or type a command..."
                                    className="flex-1 min-w-0 bg-transparent text-md-on-background text-lg md:text-xl font-display placeholder:text-md-on-surface-variant/50 !border-none !outline-none !ring-0 !shadow-none focus:!border-none focus:!outline-none focus:!ring-0 focus:!shadow-none"
                                />
                                <div className="flex gap-2 items-center shrink-0 ml-4">
                                    <span className="mono text-[10px] sm:text-xs text-md-on-surface-variant px-2 py-1 bg-md-surface-variant rounded-md">ESC</span>
                                </div>
                            </div>

                            <Command.List className="overflow-y-auto flex-1 p-4 custom-scrollbar">
                                <Command.Empty className="py-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-md-surface-variant/50 flex items-center justify-center mb-4 border border-md-outline/30">
                                        <Search size={28} className="text-md-on-surface-variant/70" />
                                    </div>
                                    <p className="text-md-on-background font-medium text-lg">No results found.</p>
                                    <p className="text-sm text-md-on-surface-variant mt-2 max-w-xs">We couldn't find anything matching your search.</p>
                                </Command.Empty>

                                {mathResult !== null && (
                                    <Command.Group heading="Calculator" className={groupClassName}>
                                        <Command.Item forceMount value={`math-${mathResult}`} className={itemClassName}>
                                            <Calculator size={18} className="text-accent" /> 
                                            <span className="font-mono text-lg font-bold text-md-on-background">= {mathResult}</span>
                                        </Command.Item>
                                    </Command.Group>
                                )}

                                <Command.Group heading="Navigation" className={groupClassName}>
                                    <Command.Item onSelect={() => { navigate('/'); setOpen(false); }} className={itemClassName}>
                                        <Home size={18} className="text-md-on-surface-variant" /> 
                                        <span className="font-medium">Go to Home</span>
                                    </Command.Item>
                                    <Command.Item onSelect={() => { navigate('/projects'); setOpen(false); }} className={itemClassName}>
                                        <Folder size={18} className="text-md-on-surface-variant" /> 
                                        <span className="font-medium">Go to Projects</span>
                                    </Command.Item>
                                    <Command.Item onSelect={() => { navigate('/resume'); setOpen(false); }} className={itemClassName}>
                                        <FileText size={18} className="text-md-on-surface-variant" /> 
                                        <span className="font-medium">Go to Resume</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Group heading="Actions" className={groupClassName}>
                                    <Command.Item 
                                        onSelect={() => { 
                                            toggleDark(new MouseEvent('click', { clientX: window.innerWidth/2, clientY: window.innerHeight/2 })); 
                                            setOpen(false); 
                                        }}
                                        className={itemClassName}
                                    >
                                        {isDark ? <Sun size={18} className="text-md-on-surface-variant" /> : <Moon size={18} className="text-md-on-surface-variant" />} 
                                        <span className="font-medium">Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Group heading="Projects" className={groupClassName}>
                                    {PROJECTS.map(p => (
                                        <Command.Item 
                                            key={p.id}
                                            value={p.title + " " + p.description + " " + p.tags.join(" ")}
                                            onSelect={() => { navigate(`/projects/${p.id}-${getSlug(p.title)}`); setOpen(false); }}
                                            className={itemClassName}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-md-background flex items-center justify-center shrink-0 border border-md-outline">
                                                <span className="font-display font-bold text-accent">{p.title.charAt(0)}</span>
                                            </div>
                                            <div className="flex-1 truncate">
                                                <span className="font-display font-medium text-md-on-background block truncate">{p.title}</span>
                                                <span className="block text-sm text-md-on-surface-variant truncate mt-0.5">{p.description}</span>
                                            </div>
                                        </Command.Item>
                                    ))}
                                </Command.Group>

                                <Command.Group heading="Skills" className={groupClassName}>
                                    {SKILLS.map(s => (
                                        <Command.Item 
                                            key={s.name}
                                            value={s.name + " " + s.level}
                                            className={itemClassName}
                                        >
                                            <Cpu size={18} className="text-md-on-surface-variant" />
                                            <span className="font-medium">{s.name}</span>
                                            <span className="ml-auto text-xs text-md-on-surface-variant px-2 py-1 bg-md-surface-variant/50 rounded-md border border-md-outline/30">{s.level}</span>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                                
                                <Command.Group heading="Social" className={groupClassName}>
                                    {CONTENT.social.map(s => (
                                        <Command.Item 
                                            key={s.name}
                                            value={s.name}
                                            onSelect={() => { window.open(s.link, '_blank'); setOpen(false); }}
                                            className={itemClassName}
                                        >
                                            <ExternalLink size={18} className="text-md-on-surface-variant" />
                                            <span className="font-medium">{s.name}</span>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
