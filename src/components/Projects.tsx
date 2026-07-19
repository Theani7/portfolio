import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { PROJECTS, slugify } from "../constants";
import TechBadge from "./TechBadge";

const Projects = () => {
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

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {PROJECTS.map((project, i) => (
                    <motion.article
                        key={project.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                    >
                        <div className="flex flex-col h-full w-full group">
                        <Link to={`/projects/${project.id}-${slugify(project.title)}`} className="block pb-5">
                            {project.image && (
                                <div className="relative overflow-hidden rounded-[14px] border border-md-outline/10 bg-md-surface-variant/20">
                                    <img
                                        src={project.image}
                                        alt={`${project.title} preview`}
                                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                        <span className="bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-medium text-[15px] border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            View Project &rarr;
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Link>
                        
                        <div className="flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-md-on-background mb-2">
                                {project.title}
                            </h3>
                            <p className="text-[15px] text-md-on-surface-variant mb-4 leading-relaxed">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto mb-2">
                                {project.tags.map((tag) => (
                                    <TechBadge key={tag} name={tag} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-6">
                            <a 
                                href={project.demo || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[15px] font-medium text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent"
                            >
                                Live Project
                            </a>
                            <a 
                                href={project.github || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 text-[15px] font-medium text-md-on-surface-variant hover:text-md-on-background transition-colors"
                            >
                                <Github size={16} /> Source Code
                            </a>
                        </div>
                    </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default Projects;
