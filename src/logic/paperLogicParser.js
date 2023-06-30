class PaperLogicParser {
	static searchPapersParser(apiResponse) {
		const obj = {
			totalFound: apiResponse.total,
			results: apiResponse.data,
		};
		return obj;
	}
}

export default PaperLogicParser;
