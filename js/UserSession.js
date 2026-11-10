class UserSession extends StorageRepository {
    #displays;

    constructor(storage, storageKey, displays) {
        super(storage, storageKey);
        this.#displays = displays;
    }

    save(name) {
        this.writeRaw(name);
        this.refresh();
    }

    get() {
        return this.readRaw(null);
    }

    refresh() {
        const name = this.get();
        if (!name) {
            return;
        }
        this.#displays.forEach(display => {
            display.textContent = name;
        });
    }
}
