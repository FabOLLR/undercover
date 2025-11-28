// Sound Effects Manager
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.initSounds();
    }

    initSounds() {
        // For now, we'll use Web Audio API to generate sounds
        // In the future, these can be replaced with actual audio files
        this.audioContext = null;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    playTimerTick() {
        if (!this.enabled) return;
        this.playBeep(600, 0.05, 0.1);
    }

    playTimerEnd() {
        if (!this.enabled) return;
        this.playBeep(800, 0.5, 0.3);
    }

    playVoteCast() {
        if (!this.enabled) return;
        this.playBeep(1000, 0.1, 0.15);
    }

    playElimination() {
        if (!this.enabled) return;
        // Descending tone
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.8);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.8);
    }

    playWin() {
        if (!this.enabled) return;
        // Victory fanfare (ascending notes)
        const ctx = this.getAudioContext();
        const notes = [523, 659, 784, 1047]; // C, E, G, C

        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = ctx.currentTime + (i * 0.15);
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    playCardFlip() {
        if (!this.enabled) return;
        // Whoosh sound
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }

    playBeep(frequency, duration, volume = 0.3) {
        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }

    getAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();
