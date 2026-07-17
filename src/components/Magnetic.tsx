import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverSound, playClickSound } from '../utils/sound';

const Magnetic = ({ children, strength = 0.2, disableHoverSound = false, disableClickSound = false }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        
        // Calculate distance from center of the element
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        setPosition({ x: middleX * strength, y: middleY * strength });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
        if (!disableHoverSound) playHoverSound();
    };

    const handleClick = () => {
        if (!disableClickSound) playClickSound();
    };

    const { x, y } = position;

    return (
        <motion.div
            style={{ position: "relative", display: "inline-flex" }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;
