import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../constants";

const getSlug = (title) =>
    String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Projects = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 380);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="mb-20 md:mb-28" aria-labelledby="projects-heading">
            {/* Section Header */}
            <div className="flex items-baseline justify-between gap-4 mb-10 pb-5 border-b border-md-outline">
                <h2 id="projects-heading" className="font-display text-3xl md:text-4xl font-medium text-md-on-background">
                    Selected Projects
                </h2>
                <span className="mono text-md-on-surface-variant">{String(PROJECTS.length).padStart(2, "0")} Total</span>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-hidden="true">
                    {[1, 2].map((item) => (
                        <div key={item} className="border border-md-outline rounded-md-lg p-6">
                            <div className="h-52 rounded-md-md bg-md-surface-variant animate-pulse mb-5" />
                            <div className="h-6 w-48 bg-md-surface-variant animate-pulse rounded" />
                            <div className="mt-3 h-4 w-full bg-md-surface-variant animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isLoading ? "hidden" : ""}`}>
                {PROJECTS.map((project, i) => (
                    <motion.article
                        key={project.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="group card rounded-md-lg overflow-hidden"
                    >
                        <Link to={`/projects/${project.id}-${getSlug(project.title)}`} className="block">
                            {project.image && (
                                <div className="overflow-hidden border-b border-md-outline">
                                    <img
                                        src={project.image}
                                        alt={`${project.title} preview`}
                                        className="w-full h-52 md:h-60 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-baseline justify-between gap-3 mb-4">
                                    <span className="mono text-md-on-surface-variant">{String(i + 1).padStart(2, "0")}</span>
                                    <ArrowUpRight size={18} className="text-md-on-surface-variant transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-md-on-background" />
                                </div>
                                <h3 className="font-display text-2xl font-medium text-md-on-background mb-3">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-md-on-surface-variant leading-relaxed mb-5">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                                    {project.tags.slice(0, 4).map((tag) => (
                                        <span key={tag} className="mono text-md-on-surface-variant">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    </motion.article>
                ))}
            </div>

            {/* Archive */}
            <div className="mt-12 pt-5 border-t border-md-outline">
                <a
                    href="https://github.com/Theani7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mono text-md-on-background link-underline"
                    aria-label="Open full GitHub project archive"
                >
                    View Full Archive <ArrowUpRight size={14} />
                </a>
            </div>
        </section>
    );
};

export default Projects;
