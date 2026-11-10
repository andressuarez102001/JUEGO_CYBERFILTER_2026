class StorageRepository {
    #storage;
    #key;

    constructor(storage, key) {
        if (new.target === StorageRepository) {
            throw new Error('StorageRepository es una clase abstracta y no puede instanciarse.');
        }
        this.#storage = storage || window.localStorage;
        this.#key = key;
    }

    get storageKey() {
        return this.#key;
    }

    readRaw(fallback = null) {
        try {
            const value = this.#storage.getItem(this.#key);
            return value === null ? fallback : value;
        } catch (error) {
            this.onReadError(error);
            return fallback;
        }
    }

    writeRaw(value) {
        try {
            this.#storage.setItem(this.#key, value);
            return true;
        } catch (error) {
            this.onWriteError(error);
            return false;
        }
    }

    readJSON(fallback = {}) {
        try {
            const raw = this.readRaw(null);
            if (raw === null) {
                return fallback;
            }
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (error) {
            this.onReadError(error);
            return fallback;
        }
    }

    writeJSON(value) {
        try {
            return this.writeRaw(JSON.stringify(value));
        } catch (error) {
            this.onWriteError(error);
            return false;
        }
    }

    remove() {
        try {
            this.#storage.removeItem(this.#key);
        } catch (error) {
            this.onWriteError(error);
        }
    }

    onReadError(error) {
        console.error('No se pudo leer el almacenamiento:', error);
    }

    onWriteError(error) {
        console.error('No se pudo escribir en el almacenamiento:', error);
    }
}
