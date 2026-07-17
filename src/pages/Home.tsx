import Hero from "../components/Hero";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

import { GitHubCalendar } from 'react-github-calendar';

const Home = () => {
    // Custom monochrome theme matching the design
    const minimalTheme = {
        light: ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373', '#404040'],
        dark: ['#171717', '#404040', '#737373', '#a3a3a3', '#f5f5f5'],
    };

    return (
        <PageWrapper>
            <Seo
                title="Anil Paneru — ML Engineer & AI Developer"
                description="Anil Paneru is a final year B.Tech student in AI & Data Science and an ML Engineer building intelligent systems, neural networks, and data-driven solutions. View his portfolio and projects."
                path="/"
            />
            <Hero />
            
            <section className="mb-20">
                <div className="flex flex-col">
                    <div className="border-b border-md-outline/20 pb-4 mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-md-on-background">
                            GitHub Activity
                        </h2>
                    </div>
                    <div className="overflow-x-auto pb-4">
                        <div className="min-w-[800px] flex justify-start sm:justify-center">
                            <GitHubCalendar 
                                username="Theani7" 
                                blockSize={13}
                                blockMargin={5}
                                colorScheme="light"
                                theme={minimalTheme}
                                fontSize={14}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
};

export default Home;
