import NodeCache from "node-cache";

class CacheHandler {
	#cache = null;
	constructor() {
		this.#cache = new NodeCache();
	}

	set(key, value, ttl = 0) {
		this.#cache.set(key, value, ttl);
	}

	listAllKeys() {
		return this.#cache.keys();
	}

	get(key) {
		return this.#cache.get(key);
	}

	remove(key) {
		this.#cache.del(key);
	}

	flush() {
		this.#cache.flushAll();
	}
}
export default CacheHandler;
