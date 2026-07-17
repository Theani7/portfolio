import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import fm from "front-matter";

// Load all markdown files from the projects directory
const projectFiles = import.meta.glob("../content/projects/*.md", { query: '?raw', import: 'default', eager: true });

const parsedProjects = Object.values(projectFiles).map((content) => {
    const { attributes, body } = fm(content as string);
    return { ...(attributes as any), markdownBody: body };
});

export const slugify = (value) =>
    String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const CONTENT = {
    name: "Anil Paneru",
    role: "AI Engineer & LLM Developer",
    bio: "AI Engineer with a B.Tech in AI and Data Science. I specialize in building intelligent systems, working with Large Language Models (LLMs), and developing scalable, data-driven solutions to solve complex engineering problems.",
    cta: {
        primary: "View Research", // Href to #projects
        secondary: "Contact Me", // Href to #contact
    },
    social: [
        { name: "GitHub", icon: Github, link: "https://github.com/Theani7" },
        { name: "LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/in/theanilpaneru/" },
        { name: "Twitter", icon: Twitter, link: "https://twitter.com" },
        { name: "Email", icon: Mail, link: "mailto:theanilpaneru@gmail.com" },
    ],
};

export const NAV_LINKS = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "resume", label: "Resume" },
];

export const SKILLS = [
    { name: "Python", level: "Expert" },
    { name: "TensorFlow", level: "Expert" },
    { name: "PyTorch", level: "Expert" },
    { name: "MongoDB", level: "Advanced" },
    { name: "SQL", level: "Advanced" },
    { name: "Machine Learning Systems", level: "Expert" },
    { name: "LLM Infrastructure", level: "Advanced" },
    { name: "Computer Vision", level: "Advanced" },
];

const normalizeProject = (project, index) => ({
    id: Number.isFinite(project?.id) ? project.id : index + 1,
    title: typeof project?.title === "string" && project.title.trim() ? project.title : "Untitled Project",
    description: typeof project?.description === "string" ? project.description : "",
    tags: Array.isArray(project?.tags) ? project.tags.filter((tag) => typeof tag === "string") : [],
    image: typeof project?.image === "string" ? project.image : "",
    demo: typeof project?.demo === "string" && project.demo.trim() ? project.demo : "#",
    github: typeof project?.github === "string" ? project.github : "",
});

export const PROJECTS = parsedProjects
    .map(normalizeProject)
    .sort((a, b) => a.id - b.id);
