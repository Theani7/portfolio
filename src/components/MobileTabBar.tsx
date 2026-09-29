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
        // Inert wrapper: owns the safe-area inset so the pill can slide clear of it.
        // Nothing here may carry opacity or transform, because an ancestor with
        // either becomes the backdrop root and collapses the child's backdrop-filter
        // mid-animation, which is why the bar used to fade in at low blur and then
        // snap to full blur. So the glass and the motion live on the same element.
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pointer-events-none">
            <motion.nav
                aria-label="Main"
                // Same unit in both states. Framer-motion appends px to numbers but
                // passes strings through, so mixing 0 with a percentage animates
                // between two different units and snaps instead of tweening.
                animate={{ y: hidden ? "130%" : "0%" }}
                initial={false}
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 38, mass: 0.7 }
                }
                // backdrop-blur-xl rather than 2xl on purpose. At 24px the content
                // behind smears into flat colour and reads as an opaque bar; 16px keeps
                // shapes discernible so the frost is legible. The near-opaque dark inner
                // rim is what makes it read as a physical glass edge, not a card.
                className={`w-full max-w-md rounded-[28px] translate-z-0 border border-white/70 dark:border-white/15 bg-white/35 dark:bg-zinc-900/40 px-2 py-1.5 backdrop-blur-xl backdrop-saturate-150 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.30),0_2px_8px_-2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.10)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.65),0_2px_8px_-2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.5)] ${hidden ? "pointer-events-none" : "pointer-events-auto"}`}
            >
            <ul className="flex items-stretch gap-1">
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
                                                // No backdrop-filter here. The nav above
                                                // carries a transform and its own
                                                // backdrop-filter, which makes it the
                                                // backdrop root, so a blur on this child
                                                // would only ever sample the nav's own
                                                // flat fill and do nothing.
                                                className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/16 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.2)]"
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
        </div>
    );
};

export default MobileTabBar;
