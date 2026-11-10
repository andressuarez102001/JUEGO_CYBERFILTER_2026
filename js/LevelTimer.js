class LevelTimer {
    static WARNING_THRESHOLD = 5;

    #element;
    #limit;
    #onTimeout;
    #remaining;
    #intervalId = null;

    constructor(element, limit, onTimeout) {
        this.#element = element || null;
        this.#limit = Number(limit) || 0;
        this.#onTimeout = typeof onTimeout === 'function' ? onTimeout : () => {};
        this.#remaining = this.#limit;
    }

    get limit() {
        return this.#limit;
    }

    get remaining() {
        return this.#remaining;
    }

    get isRunning() {
        return this.#intervalId !== null;
    }

    start() {
        this.stop();
        this.#remaining = this.#limit;
        this.#render();
        if (!this.#limit) {
            return;
        }
        this.#intervalId = setInterval(() => {
            this.#remaining -= 1;
            this.#render();
            if (this.#remaining <= 0) {
                this.stop();
                this.#onTimeout();
            }
        }, 1000);
    }

    stop() {
        if (this.#intervalId !== null) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    reset() {
        this.stop();
        this.#remaining = this.#limit;
        this.#render();
    }

    #render() {
        if (!this.#element) {
            return;
        }
        const total = Math.max(0, this.#remaining);
        const minutes = String(Math.floor(total / 60)).padStart(2, '0');
        const seconds = String(total % 60).padStart(2, '0');
        this.#element.textContent = `${minutes}:${seconds}`;
        this.#element.classList.toggle(
            'timer-warning',
            this.#limit > 0 && total <= LevelTimer.WARNING_THRESHOLD
        );
    }
}
