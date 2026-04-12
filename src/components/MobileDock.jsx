import { NavLink } from "react-router-dom";
import { FolderKanban, House, MessageCircleMore } from "lucide-react";

const navClass = ({ isActive }) =>
    `tap-feedback flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all duration-200 min-h-[44px] ${
        isActive
            ? "bg-[#111111] text-[#F9F9F7]"
            : "text-[#111111] hover:text-[#CC0000]"
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
            <div className="mx-auto max-w-sm border-2 border-[#111111] bg-[#F9F9F7] p-1">
                <div className="grid grid-cols-3 items-center">
                    <NavLink to="/" className={navClass} onClick={pulse}>
                        <House size={16} strokeWidth={1.5} />
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-widest">Home</span>
                    </NavLink>
                    <NavLink to="/projects" className={navClass} onClick={pulse}>
                        <FolderKanban size={16} strokeWidth={1.5} />
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-widest">Projects</span>
                    </NavLink>
                    <button
                        type="button"
                        onClick={openChat}
                        className="tap-feedback flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 text-[#111111] hover:text-[#CC0000] transition-colors min-h-[44px]"
                        aria-label="Open AI chat"
                    >
                        <MessageCircleMore size={16} strokeWidth={1.5} />
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-widest">AI</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default MobileDock;
