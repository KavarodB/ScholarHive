import isEmptyObject from "../../utils/isEmpty.js";

test("should return true for null", () => {
	const obj = null;
	expect(isEmptyObject(obj)).toBe(true);
});

test("should return true for basic type (number)", () => {
	const obj = 10;
	expect(isEmptyObject(obj)).toBe(true);
});
test("should return true for empty object", () => {
	const obj = {};
	expect(isEmptyObject(obj)).toBe(true);
});

test("should return false for a standard object", () => {
	const obj = { authorid: 1, name: "Test" };
	expect(isEmptyObject(obj)).toBe(false);
});
