import React, { useState } from 'react';

const iconMap: Record<string, string> = {
    "Next.js": "Next.js.png",
    "FastAPI": "FastAPI.png",
    "Scikit-learn": "scikit-learn.png",
    "Tailwind CSS": "Tailwind-CSS.png",
    "Python": "Python.png",
    "TensorFlow": "TensorFlow.png",
    "OpenCV": "OpenCV.png",
    "PyTorch": "PyTorch.png",
    "MongoDB": "MongoDB.png",
    "React": "React.png",
    "Node.js": "Node.js.png",
    "TypeScript": "TypeScript.png",
    "Vite": "Vite.png",
    "Docker": "Docker.png",
    "AWS": "AWS.png",
    "SQL": "SQLite.png",
    "HuggingFace": "Hugging Face.png",
    "LangChain": "langchain.png",
    "LlamaIndex": "llamaindex.png",
    "OpenAI API": "openAI.png",
    "Anthropic API": "Anthropic .png",
};

const urlMap: Record<string, string> = {
    "Next.js": "https://nextjs.org/",
    "FastAPI": "https://fastapi.tiangolo.com/",
    "Scikit-learn": "https://scikit-learn.org/",
    "Tailwind CSS": "https://tailwindcss.com/",
    "Python": "https://www.python.org/",
    "TensorFlow": "https://www.tensorflow.org/",
    "OpenCV": "https://opencv.org/",
    "PyTorch": "https://pytorch.org/",
    "MongoDB": "https://www.mongodb.com/",
    "React": "https://react.dev/",
    "Node.js": "https://nodejs.org/",
    "TypeScript": "https://www.typescriptlang.org/",
    "Vite": "https://vitejs.dev/",
    "Docker": "https://www.docker.com/",
    "AWS": "https://aws.amazon.com/",
    "SQL": "https://en.wikipedia.org/wiki/SQL",
    "HuggingFace": "https://huggingface.co/",
    "Git": "https://git-scm.com/",
    "LangChain": "https://www.langchain.com/",
    "LlamaIndex": "https://www.llamaindex.ai/",
    "OpenAI API": "https://openai.com/api/",
    "Anthropic API": "https://www.anthropic.com/api",
};

interface TechBadgeProps {
    name: string;
    className?: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ name, className = "" }) => {
    const [hasError, setHasError] = useState(false);
    
    // Check map, or fallback to exact name + .png
    const fileName = iconMap[name] || `${name}.png`;
    const imagePath = `/images/tech-stack/${fileName}`;
    
    // Check url map, or fallback to a google search
    const linkUrl = urlMap[name] || `https://www.google.com/search?q=${encodeURIComponent(name + ' technology')}`;

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
