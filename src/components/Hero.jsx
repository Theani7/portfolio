import { CONTENT } from "../constants";
import { motion } from "framer-motion";
import Hello from "./Hello";

const Hero = () => {
    const emailLink = CONTENT.social.find((item) => item.name === "Email")?.link || "mailto:theanilpaneru@gmail.com";
    const linkedInLink = CONTENT.social.find((item) => item.name === "LinkedIn")?.link || "https://www.linkedin.com";

    return (
        <section className="mb-16 md:mb-24" aria-labelledby="hero-heading">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
            >
                {/* Status Badge */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block bg-[#CC0000] text-[#F9F9F7] text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 font-semibold">
                        Available
                    </span>
                    <span className="h-px flex-grow bg-[#111111]" />
                </div>

                {/* Massive Headline */}
                <h1 id="hero-heading" className="font-serif text-5xl sm:text-6xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-[#111111] mb-6 md:mb-8">
                    <Hello /> I'm<br />
                    {CONTENT.name.split(' ')[0]}<span className="text-[#CC0000]"> {CONTENT.name.split(' ').slice(1).join(' ')}</span>.
                </h1>

                {/* Sub-headline with accent */}
                <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111] mb-6 md:mb-8">
                    I build <span className="serif-italic text-[#CC0000]">intelligent systems</span> that scale.
                </p>

                {/* Body with Drop Cap */}
                <p className="drop-cap-accent font-body text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8 md:mb-10 text-justify">
                    Final year B.Tech student in AI & Data Science with deep expertise in Data Science and Machine Learning. I specialize in building intelligent systems, architecting neural networks, and developing data-driven solutions for complex problems.
                </p>

                {/* CTA Buttons — Sharp Corners */}
                <div className="flex flex-wrap items-center gap-4">
                    <a
                        href={emailLink}
                        className="tap-feedback inline-flex items-center bg-[#111111] text-[#F9F9F7] border border-transparent px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-[#111111] hover:border-[#111111] min-h-[44px]"
                        aria-label="Hire me via email"
                    >
                        Hire Me
                    </a>
                    <a
                        href={linkedInLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap-feedback inline-flex items-center border border-[#111111] bg-transparent px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] transition-all duration-200 hover:bg-[#111111] hover:text-[#F9F9F7] min-h-[44px]"
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
