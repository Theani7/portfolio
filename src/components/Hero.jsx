import { CONTENT } from "../constants";
import { motion } from "framer-motion";
import Hello from "./Hello";

const Hero = () => {
    const emailLink = CONTENT.social.find((item) => item.name === "Email")?.link || "mailto:theanilpaneru@gmail.com";
    const linkedInLink = CONTENT.social.find((item) => item.name === "LinkedIn")?.link || "https://www.linkedin.com";

    return (
        <section className="relative mb-16 md:mb-24" aria-labelledby="hero-heading">
            {/* Organic Blur Shapes */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-md-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-40 -left-20 w-72 h-72 bg-md-secondary-container/40 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative"
            >
                {/* Status Badge */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 bg-md-tertiary text-md-on-tertiary text-xs font-medium px-4 py-1.5 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Available for hire
                    </span>
                </div>

                {/* Headline */}
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-md-on-background mb-6">
                    <Hello /> I'm {CONTENT.name.split(' ')[0]}
                    <span className="text-md-primary"> {CONTENT.name.split(' ').slice(1).join(' ')}</span>
                </h1>

                {/* Sub-headline */}
                <p className="text-xl md:text-2xl font-medium text-md-on-surface-variant mb-6">
                    I build <span className="text-md-primary">intelligent systems</span> that scale.
                </p>

                {/* Body */}
                <p className="text-base text-md-on-surface-variant leading-relaxed max-w-2xl mb-8">
                    Final year B.Tech student in AI & Data Science with deep expertise in Data Science and Machine Learning. I specialize in building intelligent systems, architecting neural networks, and developing data-driven solutions for complex problems.
                </p>

                {/* CTA Buttons — Pill Shaped */}
                <div className="flex flex-wrap items-center gap-4">
                    <a
                        href={emailLink}
                        className="inline-flex items-center bg-md-primary text-md-on-primary px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:bg-md-primary/90 active:scale-95 shadow-md hover:shadow-lg min-h-[44px]"
                        aria-label="Hire me via email"
                    >
                        Hire Me
                    </a>
                    <a
                        href={linkedInLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center border border-md-outline bg-transparent px-6 py-3 text-sm font-medium rounded-full text-md-primary transition-all duration-200 hover:bg-md-primary/10 active:scale-95 min-h-[44px]"
                        aria-label="Book a call via LinkedIn"
                    >
                        Book a Call
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
