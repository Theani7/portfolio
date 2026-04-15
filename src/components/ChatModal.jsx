import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";
import { CONTENT, PROJECTS, SKILLS } from "../constants";

const ChatModal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { type: "ai", content: `Hello! I'm ${CONTENT.name}'s AI assistant. Ask me anything about his projects, skills, or experience.` }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    if (!isOpen) return null;

    // Fallback: Rule-based logic (Legacy - Enhanced)
    const getFallbackResponse = (text) => {
        const lowerText = text.toLowerCase().trim();

        // High priority: Specific Expertise & User Typos
        if (lowerText.includes("python") || lowerText.includes("pythn")) {
            return "I am an **Expert in Python**, primarily using it for architecting scalable AI pipelines, deep learning research, and building high-performance backend systems with FastAPI and Flask.";
        }
        if (lowerText.includes("tensorflow") || lowerText.includes("tensor") || lowerText.includes("tansorflow")) {
            return "My **TensorFlow** expertise covers building complex neural networks, custom training loops, and deploying models for real-time inference, as seen in my Violence Detection System.";
        }
        if (lowerText.includes("pytorch") || lowerText.includes("torch")) {
            return "I use **PyTorch** extensively for deep learning research and production-level model development, particularly in NLP and Computer Vision tasks.";
        }
        if (lowerText.includes("mongo") || lowerText.includes("db") || lowerText.includes("database") || lowerText.includes("sql") || lowerText.includes("postgres")) {
            return "On the data layer, I am proficient with both **MongoDB** for document-oriented storage and **SQL** (PostgreSQL/MySQL) for relational data modeling and complex query optimization.";
        }
        if (lowerText.includes("system") || lowerText.includes("infrastructure") || lowerText.includes("architecture") || lowerText.includes("mlops")) {
            return "I specialize in **Machine Learning Systems**—designing end-to-end pipelines that handle everything from data ingestion to model deployment and monitoring at scale.";
        }
        if (lowerText.includes("ml") || lowerText.includes("machine learning") || lowerText.includes("ai") || lowerText.includes("intelligence")) {
            return "My focus is on **Applied AI and Machine Learning**. I enjoy bridging the gap between research and production, ensuring models aren't just accurate, but also scalable and reliable.";
        }

        // Feature Categories
        if (lowerText.includes("project") || lowerText.includes("work") || lowerText.includes("latest") || lowerText.includes("portfolio")) {
            return "I have worked on several key projects, notably the **IntelliML Platform** (automated machine learning) and the **Violence Detection System** (real-time video analytics). Which one would you like to explore?";
        }
        if (lowerText.includes("skill") || lowerText.includes("expert") || lowerText.includes("stack") || lowerText.includes("tech")) {
            const topSkills = SKILLS.slice(0, 5).map(s => s.name).join(", ");
            return `My core technical stack includes **${topSkills}**. I am particularly strong in Python-based AI development and ML infrastructure.`;
        }
        if (lowerText.includes("contact") || lowerText.includes("reach") || lowerText.includes("email") || lowerText.includes("hire") || lowerText.includes("talk")) {
            return "The best way to reach me is via **Email** (theanilpaneru@gmail.com) or through my **LinkedIn** profile. I'm always open to discussing technical challenges or collaboration opportunities.";
        }
        if (lowerText.includes("about") || lowerText.includes("who are you") || lowerText.includes("identity")) {
            return "I'm a **Final Year B.Tech student in AI & Data Science** with deep expertise in Data Science and Machine Learning. I specialize in building intelligent systems, architecting neural networks, and developing data-driven solutions for complex problems.";
        }

        // Generic greetings/help
        if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey") || lowerText.includes("greet")) {
            return "Hello! I'm Anil's digital twin. I can tell you all about his technical expertise, latest research projects, or how to get in touch. What's on your mind?";
        }

        return "That's an interesting question! While I'm currently running in a focused 'Intelligence Mode', I can specifically discuss my **Projects**, **Technical Skills** (like Python, TensorFlow, or MongoDB), or **Experience**. Want to dive into one of those?";
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: "user", content: userMessage }]);
        setInput("");
        setIsTyping(true);

        // Simulate network delay for fallback
        setTimeout(() => {
            const response = getFallbackResponse(userMessage);
            setIsTyping(false);
            setMessages(prev => [...prev, { type: "ai", content: response }]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-md-on-background/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-md-background rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
                {/* Header */}
                <div className="bg-md-primary px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-md-on-primary/20 flex items-center justify-center">
                            <Bot size={20} className="text-md-on-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-md-on-primary">Ask AI</h3>
                            <p className="text-xs text-md-on-primary/70">Assistant</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-md-on-primary/70 hover:bg-md-on-primary/20 hover:text-md-on-primary transition-all duration-200 active:scale-95">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-md-background">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === "ai" ? "bg-md-primary/10 text-md-primary" : "bg-md-tertiary text-md-on-tertiary"}`}>
                                {msg.type === "ai" ? <Bot size={14} /> : <User size={14} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.type === "ai"
                                ? "bg-md-surface text-md-on-surface-variant rounded-tl-sm"
                                : "bg-md-primary text-md-on-primary rounded-tr-sm"
                                }`}>
                                {msg.content.split('\n').map((line, j) => (
                                    <p
                                        key={j}
                                        className={j > 0 ? "mt-2" : ""}
                                        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center shrink-0">
                                <Bot size={14} />
                            </div>
                            <div className="bg-md-surface rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-md-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-md-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-md-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-md-surface border-t border-md-outline/20">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about projects, skills..."
                            className="flex-1 bg-md-surface-variant rounded-full px-4 py-3 text-sm text-md-on-background placeholder:text-md-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-md-primary/30 transition-all duration-200"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="bg-md-primary hover:bg-md-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-md-on-primary rounded-full p-3 transition-all duration-200 active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
