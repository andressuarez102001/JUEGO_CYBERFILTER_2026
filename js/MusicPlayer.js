class MusicPlayer {
    constructor(audio, options = {}) {
        this.audio = audio;
        this.volume = options.volume !== undefined ? options.volume : 0.5;
    }

    activateOnFirstClick(target) {
        target.addEventListener('click', () => this.play(), { once: true });
    }

    play() {
        if (!this.audio) {
            return;
        }
        this.audio.muted = false;
        this.audio.volume = this.volume;
        this.audio.play().catch(error => {
            console.error("La reproducción de audio fue bloqueada:", error);
        });
    }
}
