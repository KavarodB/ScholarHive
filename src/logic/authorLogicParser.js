import PaperAuthorData from "../classes/PaperAuthorData.js";
import PaperCitationData from "../classes/PaperCitationData.js";
import PaperCoAuthorData from "../classes/PaperCoAuthorData.js";
import { getPaperIndexesByCitationBoundry } from "../utils/getPapersByCitationBoundry.js";

class AuthorLogicParser {
	static authorIdParser(apiResponse) {
		// Parser paper data.
		const paperData = new PaperAuthorData(
			apiResponse.authorId,
			apiResponse.papers
		);

		// Find the cluster points of all papers that reach the quota of 10K citations OR up to 500 papers.
		let indexes = getPaperIndexesByCitationBoundry(apiResponse.papers);

		console.log("Limit: ", apiResponse.paperCount);
		console.log("Indexes: ", indexes);

		//Response building.
		const responseObj = {
			authorId: apiResponse.authorId,
			name: apiResponse.name,
			aliases: apiResponse.aliases,
			affiliations: apiResponse.affiliations,
			homepage: apiResponse.homepage,
			paperCount: apiResponse.paperCount,
			citationCount: apiResponse.citationCount,
			hIndex: apiResponse.hIndex,
			index: indexes,
			paperData: paperData,
		};

		return responseObj;
	}

	static authorNameParser(apiResponse) {
		//sort response by hIndex desending.
		const content = apiResponse.data;
		return content.sort((a, b) => (a.hIndex > b.hIndex ? -1 : 1));
	}

	static authorPapersParser(authorId, apiResponse) {
		const citationData = new PaperCitationData(authorId, apiResponse);
		return citationData;
	}

	static authorCoAuthorParser(coauthors) {
		let coAuthorsArray = [];
		const content = coauthors;
		content.forEach((coauthor) => {
			if (coauthor.papers.length == 0) {
				console.log(coauthor.authorId);
				return;
			}
			const paperData = new PaperCoAuthorData(coauthor.papers);
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
