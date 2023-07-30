import PaperAuthorData from "../classes/PaperAuthorData.js";
import PaperCitationData from "../classes/PaperCitationData.js";
import PaperCoAuthorData from "../classes/PaperCoAuthorData.js";
import filterPaperWithTotalCitation from "../utils/sortPapersByCitations.js";
class AuthorLogicParser {
	static authorIdParser(apiResponse) {
		// Parser paper data.
		const paperData = new PaperAuthorData(
			apiResponse.authorId,
			apiResponse.papers
		);
		// Find the limit of papers that reach the quota of 10K citations.
		let index = filterPaperWithTotalCitation(apiResponse.papers).length;
		// Add increment for edge case.
		if (
			apiResponse.paperCount > 500 &&
			apiResponse.citationCount > paperData.citationCount &&
			paperData.citationCount < 9500
		) {
			//Papers left to max
			const delta1 = apiResponse.paperCount - index;
			//Citations left to max.
			const delta2 = apiResponse.citationCount - paperData.citationCount;
			//Citations left to goal
			const delta3 = 10500 - paperData.citationCount;
			// Added ratio to goal.
			const delta4 = Math.round((delta3 * delta1) / delta2);
			index = index + delta4;
		}

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
			index: index,
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
		const content = apiResponse.data;
		const citationData = new PaperCitationData(authorId, content);
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
