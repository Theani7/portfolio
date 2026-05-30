import { CONTENT } from "../constants";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    const emailLink = CONTENT.social.find((item) => item.name === "Email")?.link || "mailto:theanilpaneru@gmail.com";
    const linkedInLink = CONTENT.social.find((item) => item.name === "LinkedIn")?.link || "https://www.linkedin.com";

    return (
        <section className="mb-20 md:mb-28" aria-labelledby="hero-heading">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
            >
                {/* Kicker */}
                <div className="flex items-center gap-3 mb-10">
                    <span className="mono text-md-on-surface-variant">{CONTENT.role}</span>
                    <span className="inline-flex items-center gap-1.5 mono text-accent">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Available
                    </span>
                </div>

                {/* Headline */}
                <h1 id="hero-heading" className="font-display font-medium tracking-tight text-md-on-background text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.98] mb-8 max-w-5xl">
                    Hello, I&apos;m {CONTENT.name.split(" ")[0]}{" "}
                    <span className="italic text-accent">{CONTENT.name.split(" ").slice(1).join(" ")}</span> — I build intelligent systems that scale.
                </h1>

                {/* Body */}
                <p className="text-base md:text-lg text-md-on-surface-variant leading-relaxed max-w-2xl mb-10">
                    {CONTENT.bio}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                    <a href={emailLink} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm min-h-[46px]" aria-label="Hire me via email">
                        Hire Me <ArrowRight size={16} />
                    </a>
                    <a href={linkedInLink} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center px-6 py-3 text-sm min-h-[46px]" aria-label="Book a call via LinkedIn">
                        Book a Call
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
