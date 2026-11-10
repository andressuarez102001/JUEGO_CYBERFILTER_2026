class Leaderboard extends StorageRepository {
    static STORAGE_KEY = 'cyberfilter_leaderboard';

    constructor(storage) {
        super(storage, Leaderboard.STORAGE_KEY);
    }

    onWriteError(error) {
        console.error('No se pudo guardar el ranking:', error);
    }

    record(name, points, maxLevel) {
        const cleanName = String(name || '').trim();
        if (!cleanName) {
            return;
        }
        const key = cleanName.toLowerCase();
        const map = this.readJSON({});
        const previous = map[key] || { name: cleanName, points: 0, maxLevel: 0 };
        map[key] = {
            name: previous.name || cleanName,
            points: Math.max(previous.points || 0, Number(points) || 0),
            maxLevel: Math.max(previous.maxLevel || 0, Number(maxLevel) || 0),
            updatedAt: Date.now()
        };
        this.writeJSON(map);
    }

    ranked() {
        return Object.values(this.readJSON({}))
            .sort((a, b) =>
                (b.points - a.points) ||
                (b.maxLevel - a.maxLevel) ||
                String(a.name).localeCompare(String(b.name))
            );
    }
}
