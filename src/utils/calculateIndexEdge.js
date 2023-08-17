export default function calcIndexEdgeCase(
	paperCount,
	citationCount,
	citationCountPaper,
	index
) {
	//Papers left to max
	const delta1 = paperCount - index;
	//Citations left to max.
	const delta2 = citationCount - citationCountPaper;
	//Citations left to goal
	const delta3 = 10000 - citationCountPaper;
	// Added ratio to goal.
	const delta4 = Math.round((delta3 * delta1) / delta2);
	return index + delta4;
}
