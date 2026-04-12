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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/50 p-4">
            <div className="w-full max-w-md bg-[#F9F9F7] border-2 border-[#111111] overflow-hidden flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-[#111111] px-4 py-3 flex items-center justify-between border-b-2 border-[#111111]">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 border border-[#CC0000]">
                            <Bot size={18} className="text-[#CC0000]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-[#F9F9F7]">Ask AI</h3>
                            <p className="text-[10px] font-mono text-neutral-400">
                                Assistant
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-neutral-400 hover:text-[#F9F9F7] transition-colors border border-neutral-600 hover:border-[#F9F9F7] p-1">
                        <X size={16} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F9F7]">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-8 h-8 border flex items-center justify-center shrink-0 ${msg.type === "ai" ? "border-[#CC0000] text-[#CC0000]" : "border-[#111111] bg-[#111111] text-[#F9F9F7]"}`}>
                                {msg.type === "ai" ? <Bot size={14} strokeWidth={1.5} /> : <User size={14} strokeWidth={1.5} />}
                            </div>
                            <div className={`max-w-[80%] border px-4 py-2.5 text-sm font-body leading-relaxed ${msg.type === "ai"
                                ? "border-[#E5E5E0] bg-white text-[#111111]"
                                : "border-[#111111] bg-[#111111] text-[#F9F9F7]"
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
                            <div className="w-8 h-8 border border-[#CC0000] text-[#CC0000] flex items-center justify-center shrink-0">
                                <Bot size={14} strokeWidth={1.5} />
                            </div>
                            <div className="border border-[#E5E5E0] bg-white px-4 py-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-[#F9F9F7] border-t-2 border-[#111111]">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about projects, skills..."
                            className="flex-1 border-b-2 border-[#111111] bg-transparent px-3 py-2 font-mono text-sm text-[#111111] placeholder:text-neutral-400 focus-visible:bg-[#F0F0F0] focus-visible:outline-none"
                            style={{ borderRadius: 0 }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="bg-[#111111] hover:bg-[#F9F9F7] hover:text-[#111111] hover:border-[#111111] disabled:opacity-50 disabled:cursor-not-allowed text-[#F9F9F7] border border-transparent p-2.5 transition-all duration-200"
                        >
                            <Send size={18} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
