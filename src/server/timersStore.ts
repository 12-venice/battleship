export class TimersStore {
    store: Record<string, any>;

    constructor() {
        this.store = {};
    }

    getStore(gameId: string) {
        return Object.keys(this.store).includes(gameId)
            ? this.store[gameId]
            : false;
    }

    addTimer(gameId: string, callback: () => void, timeout = 30000) {
        const timer = setInterval(() => {
            callback();
        }, timeout);
        this.store[gameId] = timer;
    }

    deleteTimer(gameId: string) {
        if (this.store[gameId]) {
            clearInterval(this.store[gameId]);
        }
    }

    updateTimer(gameId: string, callback: () => void, timeout = 30000) {
        this.deleteTimer(gameId);
        this.addTimer(gameId, callback, timeout);
    }
}
