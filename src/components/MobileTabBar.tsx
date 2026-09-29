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

    return (
        // Outer layer is click-through so the gaps between tabs stay tappable
        // content, not dead glass.
        <nav
            aria-label="Main"
            className="sm:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pointer-events-none"
        >
            <ul
                // translate-z-0 promotes this to its own compositing layer. Without it,
                // backdrop-filter on a fixed element can fail to paint until a scroll
                // forces a repaint, leaving the bar invisible at rest on some phones.
                // The opaque-enough background is the fallback if the blur is dropped.
                className="pointer-events-auto flex w-full max-w-md items-stretch gap-1 rounded-[28px] translate-z-0 border border-white/70 dark:border-white/15 bg-white/80 dark:bg-zinc-900/75 px-2 py-1.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_34px_-10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_10px_34px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.14)]"
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
        </nav>
    );
};

export default MobileTabBar;
