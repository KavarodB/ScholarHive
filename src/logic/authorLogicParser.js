import PaperAuthorData from "../classes/PaperAuthorData.js";
import PaperCitationData from "../classes/PaperCitationData.js";
import PaperCoAuthorData from "../classes/PaperCoAuthorData.js";

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
	static authorPapersParser(authorId, coauthorIds, apiResponse) {
		const citationData = new PaperCitationData(
			authorId,
			coauthorIds,
			apiResponse.data
		);
		return citationData;
	}

	static authorCoAuthorParser(coauthors, fieldOfStudy) {
		let coAuthorsArray = [];
		coauthors.forEach((coauthor) => {
			const paperData = new PaperCoAuthorData(
				coauthor.papers,
				fieldOfStudy.slice(0, 2)
			);
			//Response building.
			const co_author = {
				authorId: coauthor.authorId,
				name: coauthor.name,
				paperCount: coauthor.paperCount,
				citationCount: coauthor.citationCount,
				hIndex: coauthor.hIndex,
				paperData: paperData,
			};
			coAuthorsArray.push(co_author);
		});
		return coAuthorsArray;
	}
}

export default AuthorLogicParser;
