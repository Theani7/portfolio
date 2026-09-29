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
      className={`sm:hidden fixed right-4 z-[55] btn-primary p-3 rounded-full shadow-md-elevation-3 min-h-[44px] min-w-[44px] flex items-center justify-center bottom-[calc(env(safe-area-inset-bottom)+5rem)] transition-opacity ${visible
          ? "opacity-100"
          : "pointer-events-none opacity-0"
        }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default MobileScrollTop;
