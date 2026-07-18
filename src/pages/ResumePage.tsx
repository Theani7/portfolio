import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const ResumePage = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-[70vh] flex flex-col items-center justify-center gap-8 py-12"
    >
        <motion.div 
            animate={{ y: [0, -8, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="mb-2"
        >
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                {/* Tail */}
                <motion.path 
                    d="M 75 80 C 100 80, 110 50, 90 40" 
                    stroke="#F59E0B" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    fill="none"
                    animate={{ rotate: [0, 15, -5, 0] }}
                    style={{ originX: "75px", originY: "80px" }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                
                {/* Body */}
                <path d="M 25 85 C 25 45, 75 45, 75 85 Z" fill="#F59E0B" />
                <path d="M 35 85 C 35 55, 65 55, 65 85 Z" fill="#FEF3C7" />
                
                {/* Ears */}
                <path d="M 25 55 L 15 25 L 40 40 Z" fill="#F59E0B" />
                <path d="M 75 55 L 85 25 L 60 40 Z" fill="#F59E0B" />
                <path d="M 27 52 L 20 32 L 37 42 Z" fill="#FCA5A5" />
                <path d="M 73 52 L 80 32 L 63 42 Z" fill="#FCA5A5" />
                
                {/* Eyes (Blinking) */}
                <motion.ellipse 
                    cx="40" cy="55" rx="4" ry="6" fill="#1F2937"
                    animate={{ scaleY: [1, 0.1, 1, 1, 1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1, 0.2, 0.3, 1] }}
                />
                <motion.ellipse 
                    cx="60" cy="55" rx="4" ry="6" fill="#1F2937"
                    animate={{ scaleY: [1, 0.1, 1, 1, 1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1, 0.2, 0.3, 1] }}
                />
                
                {/* Nose and Mouth */}
                <path d="M 48 65 L 52 65 L 50 68 Z" fill="#FCA5A5" />
                <path d="M 50 68 Q 45 74, 40 70" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M 50 68 Q 55 74, 60 70" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                
                {/* Paws (Waiting) */}
                <path d="M 30 85 Q 30 75, 40 75 Q 40 85, 30 85 Z" fill="#F59E0B" />
                <path d="M 60 85 Q 60 75, 70 75 Q 70 85, 60 85 Z" fill="#F59E0B" />
            </svg>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-md-on-background">Nothing here yet...</h1>
        <p className="text-md-on-surface-variant text-lg max-w-md text-center">
            I'm still putting the finishing touches on my resume! This impatient kitty is waiting here in the meantime. Check back later!
        </p>
        <Link
            to="/"
            className="px-6 py-3 rounded-full bg-md-on-background text-md-background font-medium hover:scale-105 transition-transform"
        >
            Go Home
        </Link>
    </motion.div>
);

export default ResumePage;