import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

import { GitHubCalendar } from 'react-github-calendar';
import TechBadge from "../components/TechBadge";
import GridDivider from "../components/GridDivider";
import GridSectionHeader from "../components/GridSectionHeader";

const Home = () => {
    const [monthsToShow, setMonthsToShow] = useState(8);
    const [isDark, setIsDark] = useState(() => 
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

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

    // Colors matching the portfolio theme tokens in light and dark mode
    const githubStatsTheme = {
        light: ['#eceae3', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        dark: ['#242424', '#0e4429', '#006d32', '#26a641', '#39d353'],
    };

    const blockSize = 16;

    return (
        <PageWrapper>
            <Seo
                title="Anil Paneru | AI Engineer"
                description="Anil Paneru is an AI Engineer and LLM Developer building intelligent systems, neural networks, and scalable data-driven solutions. View his portfolio and projects."
                path="/"
            />
            <GridDivider className="!mt-0 !mb-6 sm:!mb-8" />
            <Hero />
            
            <section className="mb-12 sm:mb-14">
                <div className="flex flex-col">
                    <GridSectionHeader title="Core Tech Stack" />
                    <div className="flex flex-wrap gap-x-4 gap-y-3">
                        {["Python", "PyTorch", "HuggingFace", "FastAPI", "Docker", "Git", "LangChain", "LlamaIndex", "OpenAI API", "Anthropic API"].map(tech => (
                            <TechBadge key={tech} name={tech} className="!text-sm px-4 py-2" />
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="mb-12 sm:mb-14">
                <div className="flex flex-col">
                    <GridSectionHeader title="GitHub Activity" />
                    <div className="p-5 sm:p-7 rounded-2xl bg-md-surface-variant/30 dark:bg-md-surface/50 border border-md-outline/30 text-md-on-surface-variant shadow-sm overflow-x-auto transition-colors duration-200">
                        <div className="flex justify-start sm:justify-center min-w-fit pr-4 sm:pr-0">
                            <GitHubCalendar 
                                username="Theani7" 
                                blockSize={blockSize}
                                blockMargin={4}
                                blockRadius={3}
                                fontSize={13}
                                transformData={selectLastHalfYear}
                                theme={githubStatsTheme}
                                colorScheme={isDark ? 'dark' : 'light'}
                                showColorLegend={false}
                                showTotalCount={false}
                                renderBlock={(block, activity) => {
                                    if (!activity.count) return block;
                                    const y = Number(block.props.y ?? 0);
                                    const textColor = isDark 
                                        ? '#ffffff' 
                                        : activity.level <= 2 
                                        ? '#0f381e' 
                                        : '#ffffff';
                                    return (
                                        <g key={activity.date}>
                                            {block}
                                            <text
                                                x={blockSize / 2}
                                                y={y + blockSize / 2}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fontSize={activity.count > 99 ? 7 : activity.count > 9 ? 8.5 : 9.5}
                                                fontWeight="700"
                                                fill={textColor}
                                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                                            >
                                                {activity.count}
                                            </text>
                                        </g>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            <GridDivider className="!mt-8 !mb-0" />
        </PageWrapper>
    );
};

export default Home;
