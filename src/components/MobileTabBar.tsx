import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Folder, FileText, Terminal } from "lucide-react";
import { NAV_LINKS } from "../constants";

const ICONS: Record<string, typeof Home> = {
    "/": Home,
    "/projects": Folder,
    "/resume": FileText,
    "/setup": Terminal,
};

const MobileTabBar = () => {
    const reduceMotion = useReducedMotion();
    const [hidden, setHidden] = useState(false);
    const lastYRef = useRef(0);

    // iOS Safari toolbar behaviour. Scroll up reveals, scroll down hides, and it
    // stays visible near the top so there is never a point with no way to navigate.
    useEffect(() => {
        lastYRef.current = window.scrollY;
        const onScroll = () => {
            const y = Math.max(window.scrollY, 0);
            const delta = y - lastYRef.current;
            if (Math.abs(delta) < 6) return; // ignore trackpad jitter and rubber-banding
            setHidden(delta > 0 && y > 80);
            lastYRef.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        // Outer layer is click-through so the gaps between tabs stay tappable
        // content, not dead glass.
        <motion.nav
            aria-label="Main"
            // 120% clears the bar regardless of safe-area inset or bar height.
            animate={{ y: hidden ? "120%" : 0 }}
            initial={false}
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 38, mass: 0.7 }
            }
            className="sm:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pointer-events-none"
        >
            <ul
                className={`pointer-events-auto flex w-full max-w-md items-stretch gap-1 rounded-[28px] translate-z-0 border border-white/70 dark:border-white/15 bg-white/80 dark:bg-zinc-900/75 px-2 py-1.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_34px_-10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_10px_34px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.14)] ${hidden ? "pointer-events-none" : ""}`}
            >
                {NAV_LINKS.map(({ to, label }) => {
                    const Icon = ICONS[to];
                    return (
                        <li key={to} className="flex-1">
                            <NavLink
                                to={to}
                                end={to === "/"}
                                className={({ isActive }) => `relative flex flex-col items-center justify-center gap-1 min-h-[48px] py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                                    isActive
                                        ? "text-md-on-background"
                                        : "text-md-on-surface-variant"
                                }`}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Sliding lens. Slightly denser than the bar so the
                                            active tab reads as refracting what's behind it. */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="tab-bar-lens"
                                                className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/16 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : { type: "spring", stiffness: 420, damping: 34, mass: 0.6 }
                                                }
                                            />
                                        )}
                                        <span className="relative flex flex-col items-center gap-1">
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.2 : 1.8}
                                                aria-hidden="true"
                                            />
                                            {label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </motion.nav>
    );
};

export default MobileTabBar;
