declare global {
    interface Window {
        audioCtx: AudioContext;
        webkitAudioContext: typeof AudioContext;
    }
}

const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!window.audioCtx) {
        window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return window.audioCtx;
};

// ponytail: merged 4 duplicate sound functions into one
const playSound = (type: 'tick' | 'thock' | 'up' | 'down') => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const configs = {
            tick: { type: 'sine', freq: 1200, end: 600, dur: 0.04, vol: 0.05 },
            thock: { type: 'triangle', freq: 400, end: 100, dur: 0.1, vol: 0.1 },
            up: { type: 'sine', freq: 300, end: 800, dur: 0.15, vol: 0.01 },
            down: { type: 'sine', freq: 600, end: 150, dur: 0.2, vol: 0.1 },
        };
        const c = configs[type];

        osc.type = c.type as OscillatorType;
        osc.frequency.setValueAtTime(c.freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(c.end, ctx.currentTime + c.dur);
        gain.gain.setValueAtTime(c.vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + c.dur);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + c.dur);
    } catch { /* ignore autoplay policy */ }
};

export const playHoverSound = () => playSound('tick');
export const playClickSound = () => playSound('thock');
export const playLightModeSound = () => playSound('up');
export const playDarkModeSound = () => playSound('down');