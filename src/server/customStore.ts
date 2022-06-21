export class CustomStore {
    store: Record<string, any>;

    constructor() {
        this.store = {};
    }

    getStore(gameId: string) {
        return Object.keys(this.store).includes(gameId)
            ? this.store[gameId]
            : false;
    }

    addToStore(gameId: string, data: any) {
        this.store[gameId] = data;
    }

    updateStore(gameId: string, data: any) {
        this.store[gameId] = data;
    }
}
