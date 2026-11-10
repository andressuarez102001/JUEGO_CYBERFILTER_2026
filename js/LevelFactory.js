class LevelFactory {
    static #registry = new Map();

    static register(type, LevelClass) {
        if (typeof LevelClass !== 'function') {
            throw new Error('LevelFactory.register requiere una clase de nivel válida.');
        }
        LevelFactory.#registry.set(String(type), LevelClass);
        return LevelFactory;
    }

    static has(type) {
        return LevelFactory.#registry.has(String(type));
    }

    static create(config, views, deps) {
        const type = config.type || (config.strict ? 'strict' : 'normal');
        const LevelClass = LevelFactory.#registry.get(type) || LevelFactory.#registry.get('normal');
        if (!LevelClass) {
            throw new Error(`No hay una clase registrada para el tipo de nivel "${type}".`);
        }
        return new LevelClass(config, views, deps);
    }

    static types() {
        return [...LevelFactory.#registry.keys()];
    }
}

LevelFactory.register('normal', Level);
LevelFactory.register('strict', StrictLevel);
