import { NavLink } from "react-router-dom";
import { FolderKanban, House, MessageCircleMore } from "lucide-react";

const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 min-h-[44px] ${
        isActive
            ? "bg-md-primary text-md-on-primary"
            : "text-md-on-background hover:bg-md-primary/10"
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
            <div className="mx-auto max-w-sm bg-md-surface rounded-3xl shadow-lg p-2">
                <div className="grid grid-cols-3 items-center gap-1">
                    <NavLink to="/" className={navClass} onClick={pulse}>
                        <House size={18} />
                        <span className="text-xs font-medium">Home</span>
                    </NavLink>
                    <NavLink to="/projects" className={navClass} onClick={pulse}>
                        <FolderKanban size={18} />
                        <span className="text-xs font-medium">Projects</span>
                    </NavLink>
                    <button
                        type="button"
                        onClick={openChat}
                        className="flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl text-md-on-background hover:bg-md-primary/10 transition-colors min-h-[44px] active:scale-95"
                        aria-label="Open AI chat"
                    >
                        <MessageCircleMore size={18} />
                        <span className="text-xs font-medium">AI</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default MobileDock;
