import React, { useState } from 'react';

const TECH: Record<string, { icon: string; url: string }> = {
    "Next.js": { icon: "Next.js.png", url: "https://nextjs.org/" },
    "FastAPI": { icon: "FastAPI.png", url: "https://fastapi.tiangolo.com/" },
    "Scikit-learn": { icon: "scikit-learn.png", url: "https://scikit-learn.org/" },
    "Tailwind CSS": { icon: "Tailwind-CSS.png", url: "https://tailwindcss.com/" },
    "Python": { icon: "Python.png", url: "https://www.python.org/" },
    "TensorFlow": { icon: "TensorFlow.png", url: "https://www.tensorflow.org/" },
    "OpenCV": { icon: "OpenCV.png", url: "https://opencv.org/" },
    "PyTorch": { icon: "PyTorch.png", url: "https://pytorch.org/" },
    "MongoDB": { icon: "MongoDB.png", url: "https://www.mongodb.com/" },
    "React": { icon: "React.png", url: "https://react.dev/" },
    "Node.js": { icon: "Node.js.png", url: "https://nodejs.org/" },
    "TypeScript": { icon: "TypeScript.png", url: "https://www.typescriptlang.org/" },
    "Vite": { icon: "Vite.png", url: "https://vitejs.dev/" },
    "Docker": { icon: "Docker.png", url: "https://www.docker.com/" },
    "AWS": { icon: "AWS.png", url: "https://aws.amazon.com/" },
    "SQL": { icon: "SQLite.png", url: "https://en.wikipedia.org/wiki/SQL" },
    "HuggingFace": { icon: "Hugging Face.png", url: "https://huggingface.co/" },
    "Git": { icon: "Git.png", url: "https://git-scm.com/" },
    "LangChain": { icon: "langchain.png", url: "https://www.langchain.com/" },
    "LlamaIndex": { icon: "llamaindex.png", url: "https://www.llamaindex.ai/" },
    "OpenAI API": { icon: "openAI.png", url: "https://openai.com/api/" },
    "Anthropic API": { icon: "Anthropic .png", url: "https://www.anthropic.com/api" },
};

interface TechBadgeProps {
    name: string;
    className?: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ name, className = "" }) => {
    const [hasError, setHasError] = useState(false);

    const entry = TECH[name];
    const imagePath = `/images/tech-stack/${entry?.icon || `${name}.png`}`;
    const linkUrl = entry?.url || `https://www.google.com/search?q=${encodeURIComponent(name + ' technology')}`;

    return (
        <a 
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Learn more about ${name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 border border-md-outline/20 rounded-md bg-md-surface-variant/10 hover:bg-md-surface-variant/30 hover:border-md-outline/40 transition-colors ${className}`}
        >
            {!hasError && (
                <img 
                    src={imagePath} 
                    alt={name} 
                    className="w-3.5 h-3.5 object-contain"
                    loading="lazy"
                    onError={() => setHasError(true)} 
                />
            )}
            <span className="text-xs text-md-on-surface-variant group-hover:text-md-on-background transition-colors">{name}</span>
        </a>
    );
};

export default TechBadge;
