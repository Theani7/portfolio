import { NavLink } from "react-router-dom";
import { FolderKanban, House, MessageCircleMore } from "lucide-react";

const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-colors duration-200 min-h-[44px] ${
        isActive ? "text-md-on-background" : "text-md-on-surface-variant"
    }`;

const MobileDock = () => {
    const pulse = () => {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    };

    const openChat = () => {
        pulse();
        window.dispatchEvent(new CustomEvent("portfolio:toggle-chat", { detail: { open: true } }));
    };

    return (
        <nav
            className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] left-4 right-4 z-[60]"
            aria-label="Mobile navigation"
        >
            <div className="mx-auto max-w-sm bg-md-surface border border-md-outline rounded-full shadow-md-elevation-2 p-1.5">
                <div className="grid grid-cols-3 items-center">
                    <NavLink to="/" className={navClass} onClick={pulse}>
                        <House size={18} strokeWidth={1.6} />
                        <span className="mono">Home</span>
                    </NavLink>
                    <NavLink to="/projects" className={navClass} onClick={pulse}>
                        <FolderKanban size={18} strokeWidth={1.6} />
                        <span className="mono">Work</span>
                    </NavLink>
                    <button
                        type="button"
                        onClick={openChat}
                        className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full text-md-on-surface-variant transition-colors min-h-[44px] active:scale-95"
                        aria-label="Open AI chat"
                    >
                        <MessageCircleMore size={18} strokeWidth={1.6} />
                        <span className="mono">AI</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default MobileDock;
