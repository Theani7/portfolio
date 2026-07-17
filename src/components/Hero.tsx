import { useState, useEffect, useRef } from "react";
import { CONTENT } from "../constants";
import { motion } from "framer-motion";
import { Copy, Check, Github, Linkedin, Mail, Twitter, Play, Pause } from "lucide-react";

const Hero = () => {
    const [copied, setCopied] = useState(false);
    const [spotifyData, setSpotifyData] = useState<any>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Fetch Spotify data on mount
        fetch('/api/spotify')
            .then(res => res.json())
            .then(data => {
                setSpotifyData(data);
                if (data.progressMs !== undefined) {
                    setProgress(data.progressMs);
                }
            })
            .catch(err => console.error("Spotify fetch error:", err));
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
        <section className="mb-20 md:mb-28 pt-8 md:pt-16" aria-labelledby="hero-heading">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="flex flex-col gap-6"
            >
                {/* Header Profile Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <img 
                        src="https://github.com/Theani7.png" 
                        alt={CONTENT.name} 
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-md-surface-variant border border-md-outline/20 object-cover shrink-0" 
                    />
                    <div>
                        <h1 id="hero-heading" className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-md-on-background mb-3">
                            {CONTENT.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg text-md-on-surface-variant">
                            <span>Engineer</span>
                            <span className="opacity-40">•</span>
                            <span>AI & Data</span>
                            <span className="opacity-40">•</span>
                            <button 
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 hover:text-md-on-background transition-colors group cursor-pointer"
                                aria-label="Copy email address"
                            >
                                <span>{email}</span>
                                {copied ? <Check size={16} className="text-[#1DB954]" /> : <Copy size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-base sm:text-lg text-md-on-surface-variant leading-relaxed max-w-3xl mt-1.5">
                    {CONTENT.bio}
                </p>

                {/* Spotify Section */}
                <div className="relative flex flex-col w-fit">
                    <audio ref={audioRef} onEnded={() => setIsPlayingPreview(false)} />
                    <a 
                        href={spotifyData?.songUrl || "https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 mt-1.5 text-sm sm:text-base text-md-on-surface-variant bg-md-surface-variant/30 hover:bg-md-surface-variant/60 w-fit px-4 py-2 rounded-full border border-md-outline/20 transition-all cursor-pointer group"
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
                                <span className="font-medium shrink-0 group-hover:text-md-on-background transition-colors">
                                    {spotifyData?.isPlaying ? "Now playing" : "Last played"}
                                </span>
                                <span className="opacity-50">—</span>
                                <span className="truncate max-w-[200px] sm:max-w-xs group-hover:text-md-on-background transition-colors">
                                    {spotifyData?.title ? `${spotifyData.title} • ${spotifyData.artist}` : "Yellow • Coldplay"}
                                </span>
                            </div>
                            {spotifyData?.durationMs && (
                                <div className="w-full bg-md-outline/10 h-[3px] mt-1 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-[#1DB954] h-full transition-all duration-1000 ease-linear" 
                                        style={{ width: `${Math.min((progress / spotifyData.durationMs) * 100, 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </a>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-5 mt-2.5">
                    {CONTENT.social.map((social) => {
                        const Icon = social.icon;
                        return (
                            <a 
                                key={social.name} 
                                href={social.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="relative group text-md-on-surface-variant hover:text-md-on-background transition-colors"
                                aria-label={`Follow on ${social.name}`}
                            >
                                <Icon size={22} strokeWidth={1.5} />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white text-md-on-background text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1 pointer-events-none whitespace-nowrap border border-md-outline/30 shadow-sm">
                                    {social.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
