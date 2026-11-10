class ScoreManager {
    constructor(storage, storageKey, inputs) {
        this.storage = storage;
        this.storageKey = storageKey;
        this.inputs = inputs;
    }

    get value() {
        return parseInt(this.storage.getItem(this.storageKey) || 0, 10);
    }

    add(points) {
        const total = this.value + points;
        this.storage.setItem(this.storageKey, total);
        this.syncInputs();
        return total;
    }

    reset() {
        this.storage.setItem(this.storageKey, 0);
        this.syncInputs();
    }

    syncInputs() {
        const total = this.value;
        this.inputs.forEach(input => {
            input.value = total;
        });
    }
}
