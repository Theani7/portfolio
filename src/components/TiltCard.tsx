import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { playHoverSound, playClickSound } from '../utils/sound';

const TiltCard = ({ children, className = "" }) => {
    const ref = useRef(null);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });

    // Map relative coordinates to gentle rotation values
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        playHoverSound();
    };

    const handleClick = () => {
        playClickSound();
    };

    return (
        <div style={{ perspective: "1500px" }} className="w-full">
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onClick={handleClick}
                style={{
                    rotateY,
                    rotateX,
                    transformStyle: "preserve-3d",
                }}
                className={className}
            >
                <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d", height: "100%", display: "flex", flexDirection: "column" }}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default TiltCard;
