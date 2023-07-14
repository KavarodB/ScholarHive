const isEmptyObject = (value) => {
	if (value == null)
		// null or undefined
		return true;

	if (typeof value !== "object")
		// boolean, number, string, function, etc.
		return true;

	const proto = Object.getPrototypeOf(value);

	// consider `Object.create(null)`, commonly used as a safe map
	// before `Map` support, an empty object as well as `{}`
	if (proto !== null && proto !== Object.prototype) return true;

	return isEmpty(value);
};

const isEmpty = (obj) => {
	let status = true;
	for (const prop in obj) {
		if (Object.hasOwn(obj, prop)) status = false;
	}
	return status;
};

export default isEmptyObject;
