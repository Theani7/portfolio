import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const MobileScrollTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`tap-feedback md:hidden fixed right-4 z-[55] border border-[#111111] bg-[#F9F9F7] p-2.5 text-[#111111] transition-all hover:bg-[#111111] hover:text-[#F9F9F7] min-h-[44px] min-w-[44px] flex items-center justify-center ${visible
          ? "bottom-[calc(env(safe-area-inset-bottom)+5.2rem)] opacity-100 translate-y-0"
          : "bottom-[calc(env(safe-area-inset-bottom)+4.2rem)] pointer-events-none opacity-0 translate-y-2"
        }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={16} strokeWidth={1.5} />
    </button>
  );
};

export default MobileScrollTop;
