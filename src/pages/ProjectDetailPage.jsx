import { Link, useParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { PROJECTS } from "../constants";

const slugify = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const idPart = String(projectId || "").split("-")[0];
    const id = Number(idPart);

    const project = PROJECTS.find((item) => item.id === id)
        || PROJECTS.find((item) => `${item.id}-${slugify(item.title)}` === projectId);

    if (!project) {
        return (
            <PageWrapper>
                <section className="mb-16 md:mb-24">
                    <p className="text-md-on-surface-variant mb-4">Project not found.</p>
                    <Link
                        to="/projects"
                        className="text-sm font-medium text-md-primary hover:bg-md-primary/10 px-4 py-2 rounded-full transition-all duration-200"
                        aria-label="Back to projects page"
                    >
                        ← Back to Projects
                    </Link>
                </section>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <article className="mb-16 md:mb-24" aria-labelledby="project-title">
                {/* Back Link */}
                <Link 
                    to="/projects" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-md-primary hover:bg-md-primary/10 px-4 py-2 rounded-full transition-all duration-200"
                >
                    ← Back to Projects
                </Link>

                {/* Header */}
                <header className="mt-8 mb-8">
                    <h1 id="project-title" className="text-3xl lg:text-4xl font-medium text-md-on-background mb-4">
                        {project.title}
                    </h1>
                    {!!project.tags?.length && (
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span key={tag} className="text-xs font-medium text-md-on-surface-variant bg-md-surface-variant px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Image */}
                {project.image && (
                    <div className="mb-8 rounded-3xl overflow-hidden shadow-md">
                        <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            className="w-full h-56 md:h-80 object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Overview */}
                <section className="mb-8 bg-md-surface rounded-3xl p-6 md:p-8">
                    <h2 className="text-lg font-medium text-md-on-background mb-4">Overview</h2>
                    <p className="text-base text-md-on-surface-variant leading-relaxed max-w-3xl">
                        {project.description || "No project description is available yet."}
                    </p>
                </section>

                {/* Action Buttons */}
                <section className="flex flex-wrap gap-4">
                    {project.demo && project.demo !== "#" && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-md-primary text-md-on-primary px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 hover:bg-md-primary/90 active:scale-95 shadow-md"
                            aria-label={`Open live demo for ${project.title}`}
                        >
                            Open Live Demo
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center border border-md-outline bg-transparent px-6 py-3 text-sm font-medium rounded-full text-md-primary transition-all duration-200 hover:bg-md-primary/10 active:scale-95"
                            aria-label={`Open GitHub repository for ${project.title}`}
                        >
                            View Source Code
                        </a>
                    )}
                </section>
            </article>
        </PageWrapper>
    );
};

export default ProjectDetailPage;
