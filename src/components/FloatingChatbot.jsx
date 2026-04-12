import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import SeamlessAI from "./SeamlessAI";

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState("mid");
    const [touchStartY, setTouchStartY] = useState(null);
    const [touchDelta, setTouchDelta] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        const onToggle = (event) => {
            if (event?.detail?.open === true) {
                setIsOpen(true);
                return;
            }
            setIsOpen((prev) => !prev);
        };

        window.addEventListener("portfolio:toggle-chat", onToggle);
        return () => window.removeEventListener("portfolio:toggle-chat", onToggle);
    }, []);

    const onTouchStart = (event) => {
        if (!isMobile) return;
        setTouchStartY(event.touches[0].clientY);
        setTouchDelta(0);
    };

    const onTouchMove = (event) => {
        if (!isMobile || touchStartY === null) return;
        const delta = event.touches[0].clientY - touchStartY;
        setTouchDelta(Math.max(0, delta));
    };

    const onTouchEnd = () => {
        if (!isMobile) return;
        if (touchDelta > 110) {
            setIsOpen(false);
        } else if (touchDelta > 55) {
            setSheetMode("mid");
        } else if (touchDelta < 20) {
            setSheetMode("full");
        }
        setTouchStartY(null);
        setTouchDelta(0);
    };

    const panelHeight = isMobile
        ? sheetMode === "full"
            ? "h-[78dvh]"
            : "h-[56dvh]"
        : "";

    const quickPrompts = ["Show my top projects", "How can I contact you?", "Recommend project for recruiter"];

    return (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.2rem)] right-4 md:bottom-6 md:right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`mb-3 w-[min(92vw,28rem)] ${panelHeight}`}
                        id="floating-chat-panel"
                        role="dialog"
                        aria-label="AI assistant chat"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        style={{ transform: touchDelta > 0 ? `translateY(${Math.min(120, touchDelta)}px)` : undefined }}
                    >
                        <div className="border-2 border-[#111111] bg-[#F9F9F7] p-4 md:p-5 h-full flex flex-col">
                            {isMobile && (
                                <button
                                    type="button"
                                    onClick={() => setSheetMode((prev) => (prev === "mid" ? "full" : "mid"))}
                                    className="mx-auto mb-2 h-1.5 w-12 bg-neutral-300"
                                    aria-label="Resize chat panel"
                                />
                            )}
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-[#CC0000] font-semibold">Ask AI</p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    type="button"
                                    className="p-1 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] transition-all duration-200"
                                    aria-label="Close chat"
                                >
                                    <X size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                            {isMobile && (
                                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            onClick={() => {
                                                window.dispatchEvent(new CustomEvent("portfolio:quick-chat", { detail: { prompt } }));
                                            }}
                                            className="tap-feedback shrink-0 border border-[#111111] px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] transition-all duration-200"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <SeamlessAI compact={true} className="max-w-none flex-1" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen((prev) => !prev)}
                type="button"
                className="tap-feedback h-12 w-12 md:h-14 md:w-14 border-2 border-[#111111] bg-[#111111] text-[#F9F9F7] hover:bg-[#F9F9F7] hover:text-[#111111] transition-all duration-200 flex items-center justify-center"
                aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
                aria-expanded={isOpen}
                aria-controls="floating-chat-panel"
            >
                {isOpen ? <X size={20} strokeWidth={1.5} /> : <MessageCircle size={20} strokeWidth={1.5} />}
            </button>
        </div>
    );
};

export default FloatingChatbot;
