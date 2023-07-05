import SearchedPaper from "../classes/SearchedPaper.js";

class PaperLogicParser {
	static searchPapersParser(apiResponse) {
		let results = [];
		const papers = apiResponse.data;
		papers.forEach((paper) => {
			const searchedPaper = new SearchedPaper(paper);
			results.push(searchedPaper);
		});
		const responseObject = {
			totalFound: apiResponse.total,
			results: results,
		};
		return responseObject;
	}
}

export default PaperLogicParser;
