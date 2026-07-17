import Projects from "../components/Projects";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

const ProjectsPage = () => {
    return (
        <PageWrapper>
            <Seo
                title="Projects — Anil Paneru"
                description="Selected AI and machine learning projects by Anil Paneru, including the IntelliML platform and a real-time violence detection system."
                path="/projects"
            />
            <Projects />
        </PageWrapper>
    );
};

export default ProjectsPage;
