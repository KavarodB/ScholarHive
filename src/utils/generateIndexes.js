function getPaperIndexesByCitationBoundry(arr) {
	// const divisitor = Math.ceil(arr.length / 20);
	// const partition = Math.floor(arr.length / divisitor);
	let index_array = [];
	let previous_index = 0;
	let counter_Citation = 0;
	let totalCitation = 0;
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];
		//Add the limit (might not be the last index) as a cluster point.
		if (i == arr.length - 1 || totalCitation > 10100) {
			index_array.push(i + 1);
			break;
		}
		if (
			counter_Citation + item.citationCount > 600 ||
			item.citationCount > 550
		) {
			index_array.push(i);
			previous_index = i - 1;
			totalCitation += counter_Citation;
			counter_Citation = 0;
		}
		// if (i != 0 && (i - previous_index) % partition == 0) {
		// 	index_array.push(i);
		// 	previous_index = i;
		// 	totalCitation = 0;
		// }
		counter_Citation += item.citationCount;
	}
	//Second iteration to "eat" lonely arrays with total sum under 200.
	index_array = eatAloneArraysUnderThreshold(arr, index_array,600);

	return index_array;
}

function eatAloneArraysUnderThreshold(arr, index_arr, threshhold) {
	for (let i = 0; i < index_arr.length - 1; i++) {
		const index = index_arr[i];
		const next_index = index_arr[i + 1];
		//If first cluster is with endIndex 0 it has only one element above the threshhold.
		//Thus skipped.
		if (index == 0) continue;
		//If two indexes are in the vicinity of 2 or 3 units from one another
		//and the cluster at index 1 has more than one element than try to merge them.
		if (
			next_index - index < 4 &&
			next_index - index > 1 &&
			arr[index - 1].citationCount < threshhold
		) {
			const next_cluster = arr.slice(index, next_index);
			let sum = 0;
			//Sum up the clusters values.
			next_cluster.forEach((element) => {
				//Should be citationCount.
				//! Bad if changed.
				sum += element.citationCount;
			});
			if (sum <= 200) {
				console.log(">");
				//Eat the next index.
				index_arr[i] = next_index;
				//Remove the next index from array.
				index_arr.splice(i + 1, 1);
			}
		}
	}
	return index_arr;
}

export { getPaperIndexesByCitationBoundry, eatAloneArraysUnderThreshold };
