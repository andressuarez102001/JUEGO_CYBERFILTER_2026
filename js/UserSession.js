class UserSession {
    constructor(storage, storageKey, displays) {
        this.storage = storage;
        this.storageKey = storageKey;
        this.displays = displays;
    }

    save(name) {
        this.storage.setItem(this.storageKey, name);
        this.refresh();
    }

    get() {
        return this.storage.getItem(this.storageKey);
    }

    refresh() {
        const name = this.get();
        if (!name) {
            return;
        }
        this.displays.forEach(display => {
            display.textContent = name;
        });
    }
}
