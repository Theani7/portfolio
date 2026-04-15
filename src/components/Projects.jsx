import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../constants";

const Projects = () => {
    const [hovered, setHovered] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const getSlug = (title) =>
        String(title || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 420);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="mb-16 md:mb-24" aria-labelledby="projects-heading">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8 md:mb-12">
                <h2 id="projects-heading" className="text-lg font-medium text-md-on-background">
                    Selected Projects
                </h2>
                <span className="h-px bg-md-outline flex-grow" />
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-hidden="true">
                    {[1, 2].map((item) => (
                        <div key={item} className="bg-md-surface rounded-3xl p-6">
                            <div className="h-48 rounded-2xl bg-md-surface-variant animate-pulse mb-4" />
                            <div className="h-6 w-48 bg-md-surface-variant animate-pulse rounded-lg" />
                            <div className="mt-3 h-4 w-full bg-md-surface-variant animate-pulse rounded" />
                            <div className="mt-2 h-4 w-5/6 bg-md-surface-variant animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Project Grid */}
            <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isLoading ? "hidden" : ""}`}
                onMouseLeave={() => setHovered(null)}
            >
                {PROJECTS.map((project, i) => (
                    <motion.article
                        key={project.id}
                        role="article"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + (i * 0.08) }}
                        onMouseEnter={() => setHovered(project.id)}
                        className={`group bg-md-surface rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${hovered && hovered !== project.id ? "md:opacity-70" : "opacity-100"}`}
                    >
                        {/* Image */}
                        {project.image && (
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={`${project.title} preview`}
                                    className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-md-surface/80 to-transparent" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            {/* Title */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <Link
                                    to={`/projects/${project.id}-${getSlug(project.title)}`}
                                    className="text-xl font-medium text-md-on-background group-hover:text-md-primary transition-colors duration-200"
                                    aria-label={`View details for ${project.title}`}
                                >
                                    {project.title}
                                </Link>
                                <ArrowUpRight
                                    size={20}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-md-primary shrink-0"
                                />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {project.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="text-xs font-medium text-md-on-surface-variant bg-md-surface-variant px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-md-on-surface-variant leading-relaxed mb-4">
                                {project.description}
                            </p>

                            {/* Links */}
                            <div className="flex items-center gap-4 pt-4 border-t border-md-outline/20">
                                <Link
                                    to={`/projects/${project.id}-${getSlug(project.title)}`}
                                    className="text-sm font-medium text-md-primary hover:underline"
                                    aria-label={`Read full case study for ${project.title}`}
                                >
                                    Case Study
                                </Link>
                                {project.demo && project.demo !== "#" && (
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-md-primary hover:underline"
                                        aria-label={`Open live demo for ${project.title}`}
                                    >
                                        Live Demo ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Archive Link */}
            <div className="mt-8 md:mt-12 text-center">
                <a
                    href="https://github.com/Theani7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-md-primary hover:bg-md-primary/10 px-4 py-2 rounded-full transition-all duration-200"
                    aria-label="Open full GitHub project archive"
                >
                    View Full Archive →
                </a>
            </div>
        </section>
    );
};

export default Projects;
