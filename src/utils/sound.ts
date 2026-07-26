let audioCtx: AudioContext | null = null;

export const playToggleSound = () => {
    if (typeof window === 'undefined') return;
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Helper to create a mechanical "click"
    const createClick = (time: number, pitch: number, duration: number) => {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();
        
        osc.type = 'square'; // harsher sound for mechanics
        osc.connect(gain);
        gain.connect(audioCtx!.destination);
        
        osc.frequency.setValueAtTime(pitch, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + duration);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
    };

    // Helper to create white noise for the sliding mechanism
    const createNoise = (time: number, duration: number) => {
        const bufferSize = audioCtx!.sampleRate * duration;
        const buffer = audioCtx!.createBuffer(1, bufferSize, audioCtx!.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx!.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx!.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        
        const gain = audioCtx!.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx!.destination);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        noise.start(time);
    };

    // Click 1 (shutter open)
    createClick(now, 300, 0.05);
    createNoise(now, 0.05);
    
    // Click 2 (shutter close) - slightly delayed and lower pitch
    createClick(now + 0.08, 200, 0.06);
    createNoise(now + 0.08, 0.06);
};
