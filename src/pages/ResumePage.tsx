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
        <FileText size={48} className="text-md-on-surface-variant/50" />
        <h1 className="text-5xl font-display font-bold text-md-on-background">Resume</h1>
        <p className="text-md-on-surface-variant text-lg">Check back soon.</p>
        <Link
            to="/"
            className="px-6 py-3 rounded-full bg-md-on-background text-md-background font-medium hover:scale-105 transition-transform"
        >
            Go Home
        </Link>
    </motion.div>
);

export default ResumePage;