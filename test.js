import { eatAloneArraysUnderThreshold, getPaperIndexesByCitationBoundry } from "./src/utils/getPapersByCitationBoundry.js";

const arrayOfPapers = [
	{ citationCount: 229 },
	{ citationCount: 84 },
	{ citationCount: 0},
	{ citationCount: 53 },
	{ citationCount: 74 },
	{ citationCount: 0 },
	{ citationCount: 0 },
	{ citationCount: 88 },
	{ citationCount: 20 },
	{ citationCount: 23 },
	{ citationCount: 5 },
	{ citationCount: 23 },
	{ citationCount: 31 },
	{ citationCount: 21 },
	{ citationCount: 667 },
	{ citationCount: 0 },
	{ citationCount: 1 },
	{ citationCount: 96 },
	{ citationCount: 243 },
	{ citationCount: 5 },
	{ citationCount: 413 },
	{ citationCount: 100 },
	{ citationCount: 88 },
	{ citationCount: 17 },
];
let index_arr = getPaperIndexesByCitationBoundry(arrayOfPapers);
console.log("PRE CHANGE",index_arr);
eatAloneArraysUnderThreshold(arrayOfPapers,index_arr,600);
//console.log(result);
