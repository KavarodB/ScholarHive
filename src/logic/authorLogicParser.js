class AuthorLogicParser {
	static authorIdParser(authorId, apiResponse) {
		let coauthorMap = new Map();
		let coauthorNameMap = new Map();
		let keywordMap = new Map();
		let yearMap = new Map();
		let mostCitedPapers = [];

		//Data manipulation.
		const papers = apiResponse.papers;
		papers.forEach((paper) => {
			if (paper.fieldsOfStudy) {
				paper.fieldsOfStudy.forEach((keyword) => {
					if (keywordMap.get(keyword)) {
						keywordMap.set(keyword, keywordMap.get(keyword) + 1);
					} else {
						keywordMap.set(keyword, 1);
					}
				});
			}
			if (paper.authors) {
				paper.authors.forEach((author) => {
					if (author.authorId != authorId) {
						if (coauthorMap.get(author.name)) {
							coauthorMap.set(author.name, coauthorMap.get(author.name) + 1);
						} else {
							coauthorMap.set(author.name, 1);
							coauthorNameMap.set(author.name, author.authorId);
						}
					}
				});
			}
			if (paper.year) {
				if (yearMap.get(paper.year)) {
					yearMap.set(paper.year, yearMap.get(paper.year) + 1);
				} else {
					yearMap.set(paper.year, 1);
				}
			}
		});

		//Sort papers by most citations
		// and return the first 3.
		mostCitedPapers = papers
			.sort((a, b) => (a.citationCount > b.citationCount ? -1 : 1))
			.slice(0, 3);

		//Sort by descending.
		keywordMap = new Map([...keywordMap.entries()].sort((a, b) => b[1] - a[1]));
		coauthorMap = new Map(
			[...coauthorMap.entries()].sort((a, b) => b[1] - a[1])
		);

		//Coauthors -> binding name with id
		let coauthorArray = Array.from(coauthorMap.keys());
		let coauthorIds = [];
		for (let index = 0; index < Math.min(coauthorArray.length, 15); index++) {
			const name = coauthorArray.shift();
			const id = coauthorNameMap.get(name);
			coauthorIds.push(id);
		}

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
			activeYears: Array.from(yearMap),
			keyword: Array.from(keywordMap),
			coauthor: Array.from(coauthorMap).slice(0, 15),
			coauthorIds: coauthorIds,
			mostCited: mostCitedPapers,
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
		let selfCitationCount = 0;
		let selfRefrenceCount = 0;
		let total = 0;
		const papers = apiResponse.data;
		papers.forEach((paper) => {
			if (paper.citations) {
				paper.citations.forEach((citation) => {
					if (citation.paperId) {
						citation.authors.forEach((author) => {
							if (author.authorId == authorId) {
								selfCitationCount++;
							}
						});
					}
				});
			}
			if (paper.references) {
				paper.references.forEach((reference) => {
					if (reference.paperId) {
						reference.authors.forEach((author) => {
							if (author.authorId == authorId) {
								selfRefrenceCount++;
							}
						});
					}
				});
			}
			if (paper.citationCount) total += paper.citationCount;
		});
		let selfcitationrate = 0;
		let divider = selfCitationCount;
		if (selfCitationCount != selfRefrenceCount) {
			divider = Math.max(selfCitationCount, selfRefrenceCount);
		}
		selfcitationrate = (total / divider).toPrecision(11);
		selfcitationrate = 100 / selfcitationrate;

		return {
			totalCitations: total,
			selfCitations: selfCitationCount,
			selfReferences: selfRefrenceCount,
			selfCitationRate: Number.parseFloat(selfcitationrate.toPrecision(4)),
		};
	}
}

export default AuthorLogicParser;
