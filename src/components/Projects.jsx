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
            <h2 id="projects-heading" className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-500 mb-8 md:mb-12 flex items-center gap-4">
                Selected Projects
                <span className="h-px bg-[#111111] flex-grow" />
            </h2>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#111111]" aria-hidden="true">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="border-b border-r md:border-r last:border-r-0 p-6">
                            <div className="h-7 w-52 animate-pulse bg-neutral-200" />
                            <div className="mt-4 h-4 w-full max-w-2xl animate-pulse bg-neutral-100" />
                            <div className="mt-2 h-4 w-5/6 max-w-xl animate-pulse bg-neutral-100" />
                            <div className="mt-4 flex gap-4">
                                <div className="h-4 w-20 animate-pulse bg-neutral-200" />
                                <div className="h-4 w-20 animate-pulse bg-neutral-200" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Newspaper Grid */}
            <div
                className={`grid grid-cols-1 md:grid-cols-2 border border-[#111111] ${isLoading ? "hidden" : ""}`}
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
                        className={`group hard-shadow-hover border-b border-r md:border-r p-6 md:p-8 last:border-r-0 bg-[#F9F9F7] transition-opacity duration-300 ${hovered && hovered !== project.id ? "md:opacity-60" : "opacity-100"}`}
                    >
                        {/* Image */}
                        {project.image && (
                            <div className="mb-4 overflow-hidden border border-[#E5E5E0]">
                                <img
                                    src={project.image}
                                    alt={`${project.title} preview`}
                                    className="w-full h-40 md:h-48 object-cover img-newsprint"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        {/* Title & Tags */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <Link
                                to={`/projects/${project.id}-${getSlug(project.title)}`}
                                className="font-serif text-2xl lg:text-3xl font-bold text-[#111111] group-hover:text-[#CC0000] transition-colors duration-200 leading-tight"
                                aria-label={`View details for ${project.title}`}
                            >
                                {project.title}
                            </Link>
                            <ArrowUpRight
                                size={18}
                                strokeWidth={1.5}
                                className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-[#111111] shrink-0 mt-1 hidden md:block"
                            />
                        </div>

                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-3">
                            {project.tags.slice(0, 3).join(" · ")}
                        </span>

                        {/* Description */}
                        <p className="font-body text-sm md:text-base text-neutral-600 leading-relaxed text-justify">
                            {project.description}
                        </p>

                        {/* Links */}
                        <div className="mt-4 flex items-center gap-4 border-t border-[#E5E5E0] pt-4">
                            <Link
                                to={`/projects/${project.id}-${getSlug(project.title)}`}
                                className="tap-feedback text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] link-hover"
                                aria-label={`Read full case study for ${project.title}`}
                            >
                                Case Study
                            </Link>
                            {project.demo && project.demo !== "#" && (
                                <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tap-feedback text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] link-hover"
                                    aria-label={`Open live demo for ${project.title}`}
                                >
                                    Live Demo ↗
                                </a>
                            )}
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
                    className="text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] link-hover"
                    aria-label="Open full GitHub project archive"
                >
                    View Full Archive →
                </a>
            </div>
        </section>
    );
};

export default Projects;
