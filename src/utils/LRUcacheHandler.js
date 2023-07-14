import NodeCache from "node-cache";

class LRUCacheHandler {
	#cache = null;
	constructor(maxSize = 4) {
		this.#cache = new NodeCache();
		this.maxSize = maxSize;
		this.lruQueue = [];
	}

	set(key, value) {
		this.#cache.set(key, value);
		this.#updateLRU(key);
		this.#evictLRUIfNeeded();
	}

	get(key) {
		const value = this.#cache.get(key);
		if (value !== undefined) {
			this.#updateLRU(key);
		}
		return value;
	}
	listAllKeys() {
		return this.#cache.keys();
	}

	remove(key) {
		this.#cache.del(key);
		this.#removeFromLRU(key);
	}

	#updateLRU(key) {
		const index = this.lruQueue.indexOf(key);
		if (index !== -1) {
			this.lruQueue.splice(index, 1);
		}
		this.lruQueue.push(key);
	}

	#evictLRUIfNeeded() {
		if (this.lruQueue.length > this.maxSize) {
			const key = this.lruQueue.shift();
			this.#cache.del(key);
		}
	}

	#removeFromLRU(key) {
		const index = this.lruQueue.indexOf(key);
		if (index !== -1) {
			this.lruQueue.splice(index, 1);
		}
	}
}

export default LRUCacheHandler;
