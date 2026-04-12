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
                    <p className="font-body text-neutral-600 mb-4">Project not found.</p>
                    <Link
                        to="/projects"
                        className="text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] link-hover"
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
            <article className="mb-16 border-b-4 border-[#111111] pb-12 md:mb-24" aria-labelledby="project-title">
                {/* Back Link */}
                <Link to="/projects" className="text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] link-hover">
                    ← Back to Projects
                </Link>

                {/* Header */}
                <header className="mt-6 mb-6">
                    <h1 id="project-title" className="font-serif text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9] text-[#111111]">
                        {project.title}
                    </h1>
                    {!!project.tags?.length && (
                        <p className="mt-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                            {project.tags.join(" · ")}
                        </p>
                    )}
                </header>

                {/* Image — Grayscale with sharp border */}
                {project.image && (
                    <div className="mb-6 border border-[#111111] overflow-hidden">
                        <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            className="w-full h-56 md:h-80 object-cover img-newsprint"
                            loading="lazy"
                        />
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-3 py-1.5 border-t border-[#E5E5E0] bg-[#F9F9F7]">
                            Fig. {project.id}.1 — {project.title}
                        </p>
                    </div>
                )}

                {/* Overview with Drop Cap */}
                <section className="mb-8">
                    <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-4">
                        Overview
                        <span className="h-px bg-[#111111] flex-grow" />
                    </h2>
                    <p className="drop-cap font-body text-base md:text-lg text-neutral-600 leading-relaxed text-justify max-w-3xl">
                        {project.description || "No project description is available yet."}
                    </p>
                </section>

                {/* Action Buttons — Sharp Corners */}
                <section className="flex flex-wrap gap-4">
                    {project.demo && project.demo !== "#" && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tap-feedback inline-flex items-center bg-[#111111] text-[#F9F9F7] border border-transparent px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-[#111111] hover:border-[#111111] min-h-[44px]"
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
                            className="tap-feedback inline-flex items-center border border-[#111111] bg-transparent px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest text-[#111111] transition-all duration-200 hover:bg-[#111111] hover:text-[#F9F9F7] min-h-[44px]"
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
