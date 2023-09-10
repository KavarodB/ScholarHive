import PaperAuthorData from "../classes/PaperAuthorData.js";
import PaperCitationData from "../classes/PaperCitationData.js";
import PaperCoAuthorData from "../classes/PaperCoAuthorData.js";

import { getPaperIndexesByCitationBoundry } from "../utils/generateIndexes.js";

import AuthorProfile from "../classes/templates/AuthorProfile.js";
import SearchResultAuthor from "../classes/templates/SearchResultAuthor.js";
import CoAuthor from "../classes/templates/CoAuthor.js";

class AuthorLogicParser {
	static authorIdParser(apiResponse) {
		// Parser paper data.
		const paperData = new PaperAuthorData(
			apiResponse.authorId,
			apiResponse.papers
		);
		// Find the cluster points of all papers that reach the quota of 10K citations OR up to 500 papers.
		const indexes = getPaperIndexesByCitationBoundry(apiResponse.papers);
		if (apiResponse.authorId == "144271439") indexes.push(550, 585);
		// console.log("Limit: ", apiResponse.paperCount);
		// console.log("Indexes: ", indexes);
		return new AuthorProfile(indexes, paperData, apiResponse);
	}

	static authorNameParser(apiResponse) {
		//sort response by hIndex desending.
		const content = apiResponse.data;
		return content
			.map((searchResult) => new SearchResultAuthor(searchResult))
			.sort((a, b) => (a.hIndex > b.hIndex ? -1 : 1));
	}

	static authorPapersParser(authorId, apiResponse) {
		const citationData = new PaperCitationData(authorId, apiResponse);
		return citationData;
	}

	static authorCoAuthorParser(coauthors) {
		const coAuthorsArray = [];
		const content = coauthors;
		content.forEach((coauthor) => {
			if (coauthor.papers.length == 0) {
				console.log(coauthor.authorId);
				return;
			}
			const paperData = new PaperCoAuthorData(coauthor.papers);
			coAuthorsArray.push(new CoAuthor(paperData, coauthor));
		});
		//Sort by citation count.
		coAuthorsArray.sort((author, author1) => {
			return author.citationCount <= author1.citationCount ? 1 : -1;
		});
		// Top 3 Fields of study as a string.
		const fields = coAuthorsArray
			.map((coauthor) => coauthor.paperData.fieldsOfStudy)
			.sort();
		return {
			coAuthors: coAuthorsArray,
			fields: Array.from(new Set(fields)),
		};
	}
}

export default AuthorLogicParser;
