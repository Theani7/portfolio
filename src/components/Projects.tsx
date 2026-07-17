import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../constants";
import TiltCard from "./TiltCard";
import TechBadge from "./TechBadge";

const getSlug = (title) =>
    String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Projects = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 380);
        return () => clearTimeout(timer);
    }, []);

    // Placeholder dates to match the aesthetic if dates are missing in data
    const mockDates = ["01.2026", "10.2025", "08.2025", "05.2025"];

    return (
        <section className="mb-20 md:mb-28" aria-labelledby="projects-heading">
            {/* Section Header */}
            <div className="border-b border-md-outline/20 pb-6 mb-8">
                <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold text-md-on-background tracking-tight mb-4">
                    Projects
                </h2>
                <p className="text-[15px] sm:text-base text-md-on-surface-variant leading-relaxed">
                    Projects I've built along the way, shaped by curiosity, AI, and a focus on building things that actually work and mean something.
                </p>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-10" aria-hidden="true">
                    {[1, 2].map((item) => (
                        <div key={item} className="border border-md-outline/20 rounded-[24px] p-6 h-[400px]">
                            <div className="h-64 sm:h-80 rounded-2xl bg-md-surface-variant animate-pulse mb-5" />
                            <div className="h-6 w-48 bg-md-surface-variant animate-pulse rounded" />
                            <div className="mt-3 h-4 w-full bg-md-surface-variant animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* List */}
            <div className={`flex flex-col gap-10 ${isLoading ? "hidden" : ""}`}>
                {PROJECTS.map((project, i) => (
                    <motion.article
                        key={project.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                    >
                        <TiltCard className="flex flex-col border border-md-outline/20 rounded-[24px] bg-md-surface overflow-hidden shadow-sm h-full w-full">
                        <Link to={`/projects/${project.id}-${getSlug(project.title)}`} className="block p-3 pb-0 group">
                            {project.image && (
                                <div className="overflow-hidden rounded-[14px] border border-md-outline/10 bg-md-surface-variant/20">
                                    <img
                                        src={project.image}
                                        alt={`${project.title} preview`}
                                        className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </Link>
                        
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-xl font-bold text-md-on-background">
                                    {project.title}
                                </h3>
                                <span className="text-[15px] text-md-on-surface-variant">
                                    {mockDates[i % mockDates.length]}
                                </span>
                            </div>
                            <p className="text-[15px] text-md-on-surface-variant mb-4 leading-relaxed">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto mb-2">
                                {project.tags.map((tag) => (
                                    <TechBadge key={tag} name={tag} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto border-t border-dashed border-md-outline/30 flex divide-x divide-dashed divide-md-outline/30 bg-md-background/50">
                            <a 
                                href={project.demo || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex-1 py-3 text-center text-[15px] text-md-on-surface-variant hover:bg-md-surface-variant/30 hover:text-md-on-background transition-colors"
                            >
                                Live link
                            </a>
                            <a 
                                href={project.github || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex-1 py-3 flex items-center justify-center gap-2 text-[15px] text-md-on-surface-variant hover:bg-md-surface-variant/30 hover:text-md-on-background transition-colors"
                            >
                                GitHub <Github size={16} />
                            </a>
                        </div>
                        </TiltCard>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default Projects;
