function mode(arr) {
	return arr.sort((a, b) => {
		return (
			arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
		);
	}).at(0);
}

export default mode;
