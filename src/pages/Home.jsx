import Hero from "../components/Hero";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

const Home = () => {
    return (
        <PageWrapper>
            <Seo
                title="Anil Paneru — ML Engineer & AI Developer"
                description="Anil Paneru is a final year B.Tech student in AI & Data Science and an ML Engineer building intelligent systems, neural networks, and data-driven solutions. View his portfolio and projects."
                path="/"
            />
            <Hero />
        </PageWrapper>
    );
};

export default Home;
