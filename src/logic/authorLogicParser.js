import PaperAuthorData from "../classes/PaperAuthorData.js";
import PaperCitationData from "../classes/PaperCitationData.js";
import PaperCoAuthorData from "../classes/PaperCoAuthorData.js";

class AuthorLogicParser {
	static authorIdParser(apiResponse) {
		const paperData = new PaperAuthorData(
			apiResponse.authorId,
			apiResponse.papers
		);
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
			paperData: paperData,
		};
		return responseObj;
	}

	static authorNameParser(apiResponse) {
		//sort response by hIndex desending.
		const content = apiResponse.data;
		return content.sort((a, b) => (a.hIndex > b.hIndex ? -1 : 1));
	}
	static authorPapersParser(authorId, coauthorIds, apiResponse) {
		const content = apiResponse.data;
		const citationData = new PaperCitationData(authorId, coauthorIds, content);
		return citationData;
	}

	static authorCoAuthorParser(coauthors, fieldOfStudy) {
		let coAuthorsArray = [];
		let fieldofStudy = fieldOfStudy.slice(0, 2);
		const content = coauthors.data;
		content.forEach((coauthor) => {
			const paperData = new PaperCoAuthorData(coauthor.papers, fieldofStudy);
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
