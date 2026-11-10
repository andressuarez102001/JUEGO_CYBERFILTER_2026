class ScoreManager extends StorageRepository {
    #targets;

    constructor(storage, storageKey, targets) {
        super(storage, storageKey);
        this.#targets = targets;
    }

    get value() {
        const parsed = parseInt(this.readRaw('0'), 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    set(value) {
        const total = Math.max(0, parseInt(value, 10) || 0);
        this.writeRaw(String(total));
        this.sync();
        return total;
    }

    add(points) {
        return this.set(this.value + (parseInt(points, 10) || 0));
    }

    reset() {
        return this.set(0);
    }

    sync() {
        const total = this.value;
        this.#targets.forEach(target => {
            if (!target) {
                return;
            }
            if (target.tagName === 'INPUT') {
                target.value = total;
            } else {
                target.textContent = total;
            }
        });
    }
}
