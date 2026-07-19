import { motion, useReducedMotion } from "framer-motion";

const PageWrapper = ({ children }) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.28 }}
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;
