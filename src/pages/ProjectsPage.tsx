import Projects from "../components/Projects";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

const projectsSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anilpaneru.com.np/" },
                { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://anilpaneru.com.np/projects" }
            ]
        },
        {
            "@type": "CollectionPage",
            "name": "Machine Learning & AI Projects",
            "url": "https://anilpaneru.com.np/projects",
            "description": "Selected AI and machine learning projects by Anil Paneru, including the IntelliML platform, SafeVision, and Intrusion Detection System."
        }
    ]
};

const ProjectsPage = () => {
    return (
        <PageWrapper>
            <Seo
                title="Projects — Anil Paneru"
                description="Selected AI and machine learning projects by Anil Paneru, including the IntelliML platform, SafeVision, and Intrusion Detection System."
                path="/projects"
                jsonLd={projectsSchema}
            />
            <Projects />
        </PageWrapper>
    );
};

export default ProjectsPage;
