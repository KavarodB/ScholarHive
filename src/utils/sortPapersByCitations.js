function filterPaperWithTotalCitation(arr) {
	let totalCitation = 0;
	const filteredArray = [];
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];
		if (item.citationCount === 0 || totalCitation + item.citationCount > 10000)
			break;
		totalCitation += item.citationCount;
		filteredArray.push(item);
	}
	return filteredArray;
}

export default filterPaperWithTotalCitation;
