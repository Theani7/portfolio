import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

import { GitHubCalendar } from 'react-github-calendar';
import TechBadge from "../components/TechBadge";

const Home = () => {
    const [monthsToShow, setMonthsToShow] = useState(8);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 500) setMonthsToShow(4);
            else if (width < 640) setMonthsToShow(6);
            else setMonthsToShow(8);
        };
        handleResize(); // Init
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Filter to show dynamically calculated months
    const selectLastHalfYear = (contributions) => {
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - monthsToShow);
        return contributions.filter(day => new Date(day.date) >= pastDate);
    };

    // GitHub native green, but replacing the empty "black/dark" squares with a whitish color
    const customGreenTheme = {
        light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        dark: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    };

    return (
        <PageWrapper>
            <Seo
                title="Anil Paneru — ML Engineer & AI Developer"
                description="Anil Paneru is an AI Engineer and LLM Developer building intelligent systems, neural networks, and scalable data-driven solutions. View his portfolio and projects."
                path="/"
            />
            <Hero />
            
            <section className="mb-20">
                <div className="flex flex-col">
                    <div className="border-b border-md-outline/20 pb-4 mb-6">
                        <h2 className="text-2xl font-bold text-md-on-background">
                            Core Tech Stack
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-3">
                        {["Python", "PyTorch", "HuggingFace", "FastAPI", "Docker", "Git", "LangChain", "LlamaIndex", "OpenAI API", "Anthropic API"].map(tech => (
                            <TechBadge key={tech} name={tech} className="!text-sm px-4 py-2" />
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="mb-20">
                <div className="flex flex-col">
                    <div className="border-b border-md-outline/20 pb-4 mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-md-on-background">
                            GitHub Activity
                        </h2>
                    </div>
                    <div className="overflow-x-auto pb-4">
                        <div className="flex justify-start sm:justify-center min-w-fit pr-4 sm:pr-0">
                            <GitHubCalendar 
                                username="Theani7" 
                                blockSize={13}
                                blockMargin={5}
                                fontSize={14}
                                transformData={selectLastHalfYear}
                                theme={customGreenTheme}
                                colorScheme="light"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
};

export default Home;
