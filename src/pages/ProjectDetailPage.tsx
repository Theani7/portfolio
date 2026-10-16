import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";
import { PROJECTS, slugify } from "../constants";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TechBadge from "../components/TechBadge";

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const id = Number(String(projectId || "").split("-")[0]);

    const project = PROJECTS.find((item) => item.id === id)
        || PROJECTS.find((item) => `${item.id}-${slugify(item.title)}` === projectId);

    if (!project) {
        return (
            <PageWrapper>
                <Seo
                    title="Project not found — Anil Paneru"
                    description="The requested project could not be found."
                    robots="noindex, nofollow"
                />
                <section className="mb-12 sm:mb-14">
                    <p className="text-md-on-surface-variant mb-5">Project not found.</p>
                    <Link to="/projects" className="inline-flex items-center gap-2 mono text-md-on-background link-underline">
                        <ArrowLeft size={14} /> Back to Projects
                    </Link>
                </section>
            </PageWrapper>
        );
    }

    const canonicalSlug = `${project.id}-${slugify(project.title)}`;
    const projectUrl = `https://anilpaneru.com.np/projects/${canonicalSlug}`;
    const projectSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anilpaneru.com.np/" },
                    { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://anilpaneru.com.np/projects" },
                    { "@type": "ListItem", "position": 3, "name": project.title, "item": projectUrl }
                ]
            },
            {
                "@type": "SoftwareSourceCode",
                "name": project.title,
                "description": project.description,
                "url": projectUrl,
                ...(project.github ? { "codeRepository": project.github } : {}),
                ...(project.tags?.length ? { "programmingLanguage": project.tags } : {}),
                "author": {
                    "@type": "Person",
                    "name": "Anil Paneru",
                    "url": "https://anilpaneru.com.np/"
                }
            }
        ]
    };

    return (
        <PageWrapper>
            <Seo
                title={`${project.title} — Anil Paneru`}
                description={project.description || `${project.title}, a project by Anil Paneru.`}
                path={`/projects/${canonicalSlug}`}
                image={project.image}
                jsonLd={projectSchema}
            />
            <article className="mb-12 sm:mb-14" aria-labelledby="project-title">
                <Link to="/projects" className="inline-flex items-center gap-2 mono text-md-on-surface-variant hover:text-md-on-background transition-colors">
                    <ArrowLeft size={14} /> Back to Projects
                </Link>

                <header className="mt-10 mb-10 pb-6 border-b border-md-outline/20">
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
                    <div className="mb-12 sm:mb-14 rounded-md-lg overflow-hidden border border-md-outline">
                        <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            width={1200}
                            height={675}
                            className="w-full aspect-video object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="grid lg:grid-cols-[1fr_300px] gap-12 mb-12 sm:mb-14">
                    <div className="space-y-12">
                        <div>
                            <p className="mono text-md-on-surface-variant pt-1 mb-4">Overview</p>
                            <div className="prose prose-lg dark:prose-invert max-w-3xl prose-headings:font-display prose-a:text-accent hover:prose-a:text-accent/80">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {(project as any).markdownBody || project.description || "No project description is available yet."}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-8">
                        <div className="bg-md-surface/50 border border-md-outline/10 rounded-2xl p-6">
                            <h3 className="font-display text-lg font-medium text-md-on-background mb-4">At a Glance</h3>
                            <dl className="space-y-4 text-[15px]">
                                {project.role && (
                                    <div>
                                        <dt className="text-md-on-surface-variant mb-1">Role</dt>
                                        <dd className="font-medium text-md-on-background">{project.role}</dd>
                                    </div>
                                )}
                                {project.timeline && (
                                    <div>
                                        <dt className="text-md-on-surface-variant mb-1">Timeline</dt>
                                        <dd className="font-medium text-md-on-background">{project.timeline}</dd>
                                    </div>
                                )}
                                {project.demo && project.demo !== "#" && (
                                    <div>
                                        <dt className="text-md-on-surface-variant mb-1">Live Demo</dt>
                                        <dd className="font-medium text-md-on-background">
                                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline underline-offset-4">
                                                View Project
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {project.github && (
                                    <div>
                                        <dt className="text-md-on-surface-variant mb-1">Source</dt>
                                        <dd className="font-medium text-md-on-background">
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline underline-offset-4">
                                                View Code
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </aside>
                </div>


            </article>
        </PageWrapper>
    );
};

export default ProjectDetailPage;
