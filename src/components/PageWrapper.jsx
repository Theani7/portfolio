import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const PageWrapper = ({ children }) => {
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);
    const previousIndexRef = useRef(0);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    const routeOrder = {
        "/": 0,
        "/projects": 1,
    };
    const currentIndex = routeOrder[location.pathname] ?? 2;
    const prevIndex = previousIndexRef.current;
    const direction = currentIndex >= prevIndex ? 1 : -1;

    useEffect(() => {
        previousIndexRef.current = currentIndex;
    }, [currentIndex]);

    const initial = prefersReducedMotion
        ? { opacity: 0 }
        : isMobile
            ? { opacity: 0, x: 20 * direction }
            : { opacity: 0, y: 10 };
    const animate = { opacity: 1, x: 0, y: 0 };
    const exit = prefersReducedMotion
        ? { opacity: 0 }
        : isMobile
            ? { opacity: 0, x: -20 * direction }
            : { opacity: 0, y: -10 };

    return (
        <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.28 }}
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;
