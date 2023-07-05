import PaperAuthorData from "../classes/PaperAuthorData.js";
import PaperCitationData from "../classes/PaperCitationData.js";

class AuthorLogicParser {
	static authorIdParser(authorId, apiResponse) {
		const paperData = new PaperAuthorData(authorId, apiResponse.papers);
		//Response building.
		const responseObj = {
			authorId: authorId,
			name: apiResponse.name,
			aliases: apiResponse.aliases,
			affiliations: apiResponse.affiliations,
			homepage: apiResponse.homepage,
			paperCount: apiResponse.paperCount,
			citationCount: apiResponse.citationCount,
			hIndex: apiResponse.hIndex,
			paperData: paperData,
		};
		return responseObj;
	}

	static authorNameParser(apiResponse) {
		const data = apiResponse.data;
		//sort response by hIndex desending.
		data.sort((a, b) => (a.hIndex > b.hIndex ? -1 : 1));
		return data;
	}
	static authorPapersParser(authorId, apiResponse) {
		const citationData = new PaperCitationData(authorId, apiResponse.data);
		return citationData;
	}
}

export default AuthorLogicParser;
