import { getPaperIndexesByCitationBoundry } from "../../utils/generateIndexes";

const arrayOfPapers = [
	{ citationCount: 157 },
	{ citationCount: 83 },
	{ citationCount: 64 },
	{ citationCount: 215 },
	{ citationCount: 124 },
	{ citationCount: 9 },
	{ citationCount: 178 },
	{ citationCount: 32 },
	{ citationCount: 70 },
	{ citationCount: 221 },
	{ citationCount: 196 },
	{ citationCount: 115 },
	{ citationCount: 253 },
	{ citationCount: 46 },
	{ citationCount: 7 },
	{ citationCount: 34 },
	{ citationCount: 12 },
	{ citationCount: 941 },
	{ citationCount: 5 },
	{ citationCount: 8 },
	{ citationCount: 6 },
	{ citationCount: 102 },
	{ citationCount: 29 },
	{ citationCount: 171 },
];

test("indexes should be correctly placed to represent buckets of around 500.", () => {
	const indexes = getPaperIndexesByCitationBoundry(arrayOfPapers, 25);
	expect(indexes).toHaveLength(6);
	let offset = 0;
	for (let index = 0; index < indexes.length; index++) {
		const boundry = indexes[index];
		const data = arrayOfPapers.slice(offset, boundry);
		const count = data
			.map((paper) => paper.citationCount)
			.reduce((accu, current) => (accu += current), 0);
		expect(Math.abs(count - 550)).toBeLessThanOrEqual(600);
		offset = boundry;
	}
});
