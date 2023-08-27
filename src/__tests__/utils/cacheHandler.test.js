import LRUCacheHandler from "../../utils/LRUcacheHandler.js";

const lruCacheHandler = new LRUCacheHandler(); // Set maximum size to 3 and expiration time to 10 seconds

beforeAll(() => {
	//Fill up cache.
	for (let index = 0; index < lruCacheHandler.maxSize; index++) {
		lruCacheHandler.set("key" + index, "value" + index);
	}
});

test("should return value properly from cache", () => {
	expect(lruCacheHandler.get("key0")).toBe("value0");
});

test("should set a new item and evict key1 ", () => {
	lruCacheHandler.set("keytest", "valuetest");
	expect(lruCacheHandler.get("key1")).toBe(undefined);
});

test("should have exactly 32 items in the list", () => {
	expect(lruCacheHandler.listAllKeys()).toHaveLength(32);
});
