import LRUCacheHandler from "../utils/cacheHandler.js";

const lruCacheHandler = new LRUCacheHandler(); // Set maximum size to 3 and expiration time to 10 seconds

beforeAll(() => {
	//Fill up cache.
	lruCacheHandler.set("key1", "value1");
	lruCacheHandler.set("key2", "value2");
	lruCacheHandler.set("key3", "value3");
	lruCacheHandler.set("key4", "value4");
});

test("should return value properly from cache", () => {
	expect(lruCacheHandler.get("key1")).toBe("value1");
});

test("should set a new item and evict key2 ", () => {
	lruCacheHandler.set("key5", "value5");
	expect(lruCacheHandler.get("key2")).toBe(undefined);
});

test("should list the 4 items in an order", () => {
	expect(lruCacheHandler.listAllKeys()).toHaveLength(4);
});
