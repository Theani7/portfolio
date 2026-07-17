import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";
import { PROJECTS } from "../constants";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TechBadge from "../components/TechBadge";

const slugify = (value) =>
    String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const id = Number(String(projectId || "").split("-")[0]);

    const project = PROJECTS.find((item) => item.id === id)
        || PROJECTS.find((item) => `${item.id}-${slugify(item.title)}` === projectId);

    if (!project) {
        return (
            <PageWrapper>
                <Seo title="Project not found — Anil Paneru" description="The requested project could not be found." path="/projects" />
                <section className="mb-20 md:mb-28">
                    <p className="text-md-on-surface-variant mb-5">Project not found.</p>
                    <Link to="/projects" className="inline-flex items-center gap-2 mono text-md-on-background link-underline">
                        <ArrowLeft size={14} /> Back to Projects
                    </Link>
                </section>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Seo
                title={`${project.title} — Anil Paneru`}
                description={project.description || `${project.title}, a project by Anil Paneru.`}
                path={`/projects/${projectId}`}
                image={project.image || "/og-image.png"}
            />
            <article className="mb-20 md:mb-28" aria-labelledby="project-title">
                <Link to="/projects" className="inline-flex items-center gap-2 mono text-md-on-surface-variant hover:text-md-on-background transition-colors">
                    <ArrowLeft size={14} /> Back to Projects
                </Link>

                <header className="mt-10 mb-10 pb-8 border-b border-md-outline">
                    <h1 id="project-title" className="font-display text-4xl lg:text-6xl font-medium tracking-tight text-md-on-background mb-6">
                        {project.title}
                    </h1>
                    {!!project.tags?.length && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                            {project.tags.map((tag) => (
                                <TechBadge key={tag} name={tag} />
                            ))}
                        </div>
                    )}
                </header>

                {project.image && (
                    <div className="mb-12 rounded-md-lg overflow-hidden border border-md-outline">
                        <img src={project.image} alt={`${project.title} preview`} className="w-full h-60 md:h-[28rem] object-cover" loading="lazy" />
                    </div>
                )}

                <div className="grid md:grid-cols-[10rem_1fr] gap-6 md:gap-10 mb-12">
                    <p className="mono text-md-on-surface-variant pt-1">Overview</p>
                    <div className="prose prose-lg dark:prose-invert max-w-3xl prose-headings:font-display prose-a:text-accent hover:prose-a:text-accent/80">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {(project as any).markdownBody || project.description || "No project description is available yet."}
                        </ReactMarkdown>
                    </div>
                </div>

                <section className="flex flex-wrap gap-3">
                    {project.demo && project.demo !== "#" && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm min-h-[46px]" aria-label={`Open live demo for ${project.title}`}>
                            Live Demo <ArrowUpRight size={16} />
                        </a>
                    )}
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm min-h-[46px]" aria-label={`Open GitHub repository for ${project.title}`}>
                            Source Code <ArrowUpRight size={16} />
                        </a>
                    )}
                </section>
            </article>
        </PageWrapper>
    );
};

export default ProjectDetailPage;
