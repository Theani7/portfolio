import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import projects from "../data/projects.json";

export const CONTENT = {
    name: "Anil Paneru",
    role: "Final Year B.Tech | AI & Data Science",
    bio: "Final year B.Tech student in AI and Data Science with deep expertise in Data Science and Machine Learning. I specialize in building intelligent systems, architecting neural networks, and developing data-driven solutions for complex problems.",
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

export const PROJECTS = Array.isArray(projects?.projects)
    ? projects.projects.map(normalizeProject)
    : [];
