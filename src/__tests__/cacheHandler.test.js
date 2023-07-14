import CacheHandler from "../utils/cacheHandler.js";

const cacheHandler = new CacheHandler(); //Simple cache implemented.

beforeAll(() => {
	//Fill up cache.
	cacheHandler.set("key1", "value1");
	cacheHandler.set("key2", "value2");
	cacheHandler.set("key3", "value3");
});

test("should return value properly from cache", () => {
	expect(cacheHandler.get("key1")).toBe("value1");
});

test("should set a new item without evicting", () => {
	cacheHandler.set("key5", "value5");
	expect(cacheHandler.get("key5")).toBe("value5");
});

test("should flush all values successfully", () => {
	cacheHandler.flush();
	expect(cacheHandler.listAllKeys()).toHaveLength(0);
});
