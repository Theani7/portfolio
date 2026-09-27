import { useState, useEffect, useRef } from "react";
import { CONTENT } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Github, Linkedin, Mail, Twitter, Play, Pause, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    const [copied, setCopied] = useState(false);
    const [spotifyData, setSpotifyData] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [githubData, setGithubData] = useState<any>(null);
    const [showGithubCard, setShowGithubCard] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showLinkedinCard, setShowLinkedinCard] = useState(false);
    const linkedinHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetch("https://api.github.com/users/Theani7")
            .then(res => res.json())
            .then(data => {
                if (data && !data.message) {
                    setGithubData(data);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const fetchSpotify = () => {
            fetch('/api/spotify')
                .then(res => res.json())
                .then(data => {
                    setSpotifyData(data);
                    if (data.progressMs !== undefined) {
                        setProgress(data.progressMs);
                    }
                })
                .catch(err => console.error("Spotify fetch error:", err));
        };
        
        fetchSpotify();
        const pollInterval = setInterval(fetchSpotify, 10000); // Check every 10 seconds
        
        return () => clearInterval(pollInterval);
    }, []);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);

    const togglePreview = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!audioRef.current || !spotifyData?.previewUrl) return;

        if (isPlayingPreview) {
            audioRef.current.pause();
            setIsPlayingPreview(false);
        } else {
            audioRef.current.src = spotifyData.previewUrl;
            audioRef.current.play();
            setIsPlayingPreview(true);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (spotifyData?.isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 1000, spotifyData.durationMs));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [spotifyData]);
    
    const email = CONTENT.social.find(s => s.name === "Email")?.link?.replace('mailto:', '') || 'theanilpaneru@gmail.com';

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="mb-12 sm:mb-14 pt-2 sm:pt-4" aria-labelledby="hero-heading">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="flex flex-col gap-6"
            >
                {/* Header Profile Section */}
                <div className="flex flex-row items-center gap-4 sm:gap-6">
                    {/* Double-bordered squircle avatar frame */}
                    <div className="p-1 sm:p-1.5 rounded-[12px] border border-black/10 dark:border-white/10 shrink-0 bg-neutral-50 dark:bg-zinc-900 shadow-xs">
                        <div className="relative w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-[8px] overflow-hidden border border-black/10 dark:border-white/20 bg-white dark:bg-zinc-950">
                            <img 
                                src="https://github.com/Theani7.png" 
                                alt={CONTENT.name} 
                                className="w-full h-full object-cover scale-[1.08] translate-y-[2px]" 
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-between items-start min-w-0">
                        <div className="flex flex-col min-w-0 pr-1">
                            <h1 id="hero-heading" className="text-[22px] sm:text-4xl font-display font-normal leading-[1.25] text-md-on-background">
                                Hi, I’m {CONTENT.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base mt-1 text-md-on-surface-variant">
                                <span className="font-normal tracking-wide">
                                    Engineer <span className="opacity-40 mx-0.5">•</span> AI <span className="opacity-40 mx-0.5">•</span> Data
                                </span>
                                <span className="opacity-40">•</span>
                                <button 
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 hover:text-md-on-background transition-colors group cursor-pointer text-sm font-sans"
                                    aria-label="Copy email address"
                                >
                                    <span>{email}</span>
                                    {copied ? <Check size={14} className="text-[#1DB954]" /> : <Copy size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-3.5 max-w-3xl mt-1.5">
                    <p className="text-base sm:text-[17px] text-md-on-surface-variant leading-relaxed">
                        I’m an <span className="font-semibold text-md-on-background underline decoration-neutral-400 dark:decoration-neutral-500 decoration-2 underline-offset-4">AI Engineer</span> & developer building intelligent systems, neural networks, and scalable ML solutions. I use <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/Python.png" alt="Python" className="w-3.5 h-3.5 inline-block object-contain" /> Python</span> and <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/PyTorch.png" alt="PyTorch" className="w-3.5 h-3.5 inline-block object-contain" /> PyTorch</span> for deep learning, <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/Hugging Face.png" alt="Hugging Face" className="w-3.5 h-3.5 inline-block object-contain" /> Hugging Face</span> and <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/langchain.png" alt="LangChain" className="w-3.5 h-3.5 inline-block object-contain" /> LangChain</span> for LLM applications, <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/FastAPI.png" alt="FastAPI" className="w-3.5 h-3.5 inline-block object-contain" /> FastAPI</span> & <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/Docker.png" alt="Docker" className="w-3.5 h-3.5 inline-block object-contain" /> Docker</span> for model deployment, and modern databases like <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/PostgresSQL.png" alt="PostgreSQL" className="w-3.5 h-3.5 inline-block object-contain" /> PostgreSQL</span> and <span className="inline-flex items-center gap-1 font-medium text-md-on-background"><img src="/images/tech-stack/MongoDB.png" alt="MongoDB" className="w-3.5 h-3.5 inline-block object-contain" /> MongoDB</span>.
                    </p>

                    <div>
                        <a 
                            href={`mailto:${email}?subject=Let's%20Connect`}
                            className="group relative inline-block"
                        >
                            <span className="border border-md-outline/30 text-md-on-background text-sm py-1.5 px-3.5 rounded-lg cursor-pointer inline-flex items-center gap-1.5 transition-all duration-300 ease-out bg-md-surface-variant/30 hover:bg-md-surface-variant/60 dark:bg-md-surface/50 dark:hover:bg-md-surface/80 group-hover:shadow-sm group-hover:-translate-y-0.5">
                                Book A Call!
                                <span className="inline-block transition-all duration-300 animate-[spin_4s_linear_infinite] group-hover:animate-[spin_0.7s_linear_infinite]">✿</span>
                            </span>
                        </a>
                    </div>
                </div>

                {/* Spotify Section */}
                <div className="relative flex flex-col w-fit mt-1">
                    <p className="text-sm text-md-on-surface-variant mb-1">
                        Here’s what I’m <strong className="font-semibold text-md-on-background">listening</strong> to
                    </p>
                    <audio ref={audioRef} onEnded={() => setIsPlayingPreview(false)} />
                    <a 
                        href={spotifyData?.songUrl || "https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 mt-1.5 text-sm sm:text-base text-md-on-surface-variant bg-md-surface-variant/30 hover:bg-md-surface-variant/60 w-fit px-4 py-2 rounded-full border border-md-outline/20 transition-all cursor-pointer group ${spotifyData?.isPlaying ? 'spotify-playing-glow border-[#1DB954]/30' : ''}`}
                    >
                        <div className="relative shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" width="20" height="20" className={`text-[#1DB954] transition-transform ${spotifyData?.previewUrl ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            {spotifyData?.previewUrl && (
                                <button 
                                    onClick={togglePreview}
                                    className="absolute inset-0 bg-[#1DB954] text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                >
                                    {isPlayingPreview ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="font-medium shrink-0 group-hover:text-md-on-background transition-colors flex items-center gap-1.5">
                                    {spotifyData?.isPlaying ? "Now playing" : "Last played"}
                                    {/* Audio Visualizer */}
                                    {spotifyData && (
                                        <div className="flex items-end gap-[2px] h-3 ml-1 opacity-80 shrink-0">
                                            <div className={`w-[2.5px] bg-[#1DB954] rounded-full transition-all ${spotifyData.isPlaying ? 'animate-equalizer-1' : 'h-[3px]'}`} />
                                            <div className={`w-[2.5px] bg-[#1DB954] rounded-full transition-all ${spotifyData.isPlaying ? 'animate-equalizer-2' : 'h-[6px]'}`} />
                                            <div className={`w-[2.5px] bg-[#1DB954] rounded-full transition-all ${spotifyData.isPlaying ? 'animate-equalizer-3' : 'h-[4px]'}`} />
                                            <div className={`w-[2.5px] bg-[#1DB954] rounded-full transition-all ${spotifyData.isPlaying ? 'animate-equalizer-4' : 'h-[3px]'}`} />
                                        </div>
                                    )}
                                </span>
                                <span className="opacity-50 shrink-0">—</span>
                                <span className="truncate max-w-[200px] sm:max-w-xs group-hover:text-md-on-background transition-colors">
                                    {spotifyData?.title ? `${spotifyData.title} • ${spotifyData.artist}` : "Yellow • Coldplay"}
                                </span>
                            </div>
                            {spotifyData?.durationMs && (
                                <div className="w-full bg-md-outline/10 h-[3px] mt-1 rounded-full overflow-hidden shrink-0">
                                    <div 
                                        className="bg-[#1DB954] h-full transition-all duration-1000 ease-linear" 
                                        style={{ width: `${Math.min((progress / spotifyData.durationMs) * 100, 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-3 mt-4">
                    <p className="text-sm text-md-on-surface-variant">
                        Here are my <strong className="font-semibold text-md-on-background">socials</strong>
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* GitHub with Hover Card */}
                        <div 
                            className="relative"
                            onMouseEnter={() => {
                                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                setShowGithubCard(true);
                            }}
                            onMouseLeave={() => {
                                hoverTimeoutRef.current = setTimeout(() => setShowGithubCard(false), 200);
                            }}
                        >
                            <a 
                                href="https://github.com/Theani7" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="px-3.5 py-1.5 rounded-lg border border-md-outline/30 bg-md-surface-variant/20 hover:bg-md-surface-variant/50 text-md-on-surface-variant hover:text-md-on-background text-sm font-medium inline-flex items-center gap-2 transition-all shadow-xs"
                                aria-label="GitHub Profile"
                            >
                                <Github size={16} strokeWidth={1.8} />
                                <span>GitHub</span>
                            </a>

                            <AnimatePresence>
                                {showGithubCard && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-md-surface border border-md-outline/30 shadow-xl text-md-on-background pointer-events-auto"
                                        onMouseEnter={() => {
                                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                            setShowGithubCard(true);
                                        }}
                                        onMouseLeave={() => {
                                            hoverTimeoutRef.current = setTimeout(() => setShowGithubCard(false), 200);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={githubData?.avatar_url || "https://github.com/Theani7.png"}
                                                alt="GitHub Avatar"
                                                className="w-12 h-12 rounded-full border border-md-outline/20 object-cover"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-sm sm:text-base text-md-on-background leading-tight truncate">
                                                    {githubData?.name || "Anil Paneru"}
                                                </span>
                                                <span className="text-xs text-md-on-surface-variant font-mono truncate">
                                                    @{githubData?.login || "Theani7"}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-[13px] text-md-on-surface-variant mt-3 leading-relaxed">
                                            {githubData?.bio || "Anything added dilutes everything else."}
                                        </p>

                                        <div className="flex items-center gap-1.5 text-xs text-md-on-surface-variant mt-2.5">
                                            <MapPin size={13} className="opacity-70 shrink-0" />
                                            <span>{githubData?.location || "Nepal"}</span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-md-outline/20 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <strong className="font-bold text-md-on-background">
                                                    {githubData?.public_repos ?? 16}
                                                </strong>
                                                <span className="text-md-on-surface-variant">Repositories</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <strong className="font-bold text-md-on-background">
                                                    {githubData?.followers ?? 2}
                                                </strong>
                                                <span className="text-md-on-surface-variant">Followers</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* LinkedIn with Hover Card */}
                        <div 
                            className="relative"
                            onMouseEnter={() => {
                                if (linkedinHoverTimeoutRef.current) clearTimeout(linkedinHoverTimeoutRef.current);
                                setShowLinkedinCard(true);
                            }}
                            onMouseLeave={() => {
                                linkedinHoverTimeoutRef.current = setTimeout(() => setShowLinkedinCard(false), 200);
                            }}
                        >
                            <a 
                                href="https://www.linkedin.com/in/theanilpaneru/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="px-3.5 py-1.5 rounded-lg border border-md-outline/30 bg-md-surface-variant/20 hover:bg-md-surface-variant/50 text-md-on-surface-variant hover:text-md-on-background text-sm font-medium inline-flex items-center gap-2 transition-all shadow-xs"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin size={16} strokeWidth={1.8} />
                                <span>LinkedIn</span>
                            </a>

                            <AnimatePresence>
                                {showLinkedinCard && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-md-surface border border-md-outline/30 shadow-xl text-md-on-background pointer-events-auto"
                                        onMouseEnter={() => {
                                            if (linkedinHoverTimeoutRef.current) clearTimeout(linkedinHoverTimeoutRef.current);
                                            setShowLinkedinCard(true);
                                        }}
                                        onMouseLeave={() => {
                                            linkedinHoverTimeoutRef.current = setTimeout(() => setShowLinkedinCard(false), 200);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://github.com/Theani7.png"
                                                alt="Anil Paneru"
                                                className="w-12 h-12 rounded-full border border-md-outline/20 object-cover"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-sm sm:text-base text-md-on-background leading-tight truncate">
                                                        Anil Paneru
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#0A66C2]/15 text-[#0A66C2]">
                                                        in
                                                    </span>
                                                </div>
                                                <span className="text-xs text-md-on-surface-variant font-mono truncate">
                                                    theanilpaneru
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-[13px] text-md-on-surface-variant mt-3 leading-relaxed">
                                            AI Engineer & LLM Developer • B.Tech in AI & Data Science
                                        </p>

                                        <div className="flex items-center gap-1.5 text-xs text-md-on-surface-variant mt-2.5">
                                            <MapPin size={13} className="opacity-70 shrink-0" />
                                            <span>Nepal</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-md-outline/20 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <strong className="font-bold text-md-on-background">500+</strong>
                                                <span className="text-md-on-surface-variant">Connections</span>
                                            </div>
                                            <span className="text-[#0A66C2] font-semibold hover:underline">
                                                View profile ↗
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Email Button */}
                        <a 
                            href={`mailto:${email}`}
                            className="px-3.5 py-1.5 rounded-lg border border-md-outline/30 bg-md-surface-variant/20 hover:bg-md-surface-variant/50 text-md-on-surface-variant hover:text-md-on-background text-sm font-medium inline-flex items-center gap-2 transition-all shadow-xs"
                            aria-label="Send Email"
                        >
                            <Mail size={16} strokeWidth={1.8} />
                            <span>Email</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
