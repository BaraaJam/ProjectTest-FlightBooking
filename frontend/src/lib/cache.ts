// Module-level cache. It survives route changes because the module does.
// Used to paint the last known list while a fresh request runs.
const store = new Map<string, unknown>();

export function readCache<T>(key: string): T | undefined {
    return store.get(key) as T | undefined;
}

export function writeCache<T>(key: string, value: T): void {
    store.set(key, value);
}
