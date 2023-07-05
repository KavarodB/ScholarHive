class SearchedPaper {
	constructor(apiData) {
		const {
			paperId,
			title,
			abstract = null,
			venue,
			year,
			citationCount,
			openAccessPdf,
			s2FieldsOfStudy,
			publicationTypes,
			authors,
		} = apiData;

		this.paperId = paperId;
		this.title = title;
		this.abstract = this.#getAbstract(abstract);
		this.venue = venue;
		this.year = year;
		this.citationCount = citationCount;
		this.openAccessPdf = openAccessPdf;
		this.fieldsOfStudy = this.#getKeywords(s2FieldsOfStudy);
		this.publicationTypes = publicationTypes;
		this.authors = this.#getAuthors(authors);
	}
	#getKeywords(s2FieldsOfStudy) {
		let keywordsSet = new Set();
		if (s2FieldsOfStudy.length > 0) {
			s2FieldsOfStudy.forEach((keyword) => {
				keywordsSet.add(keyword.category);
			});
		}
		return Array.from(keywordsSet);
	}
	#getAbstract(abstract) {
		if (abstract == null) {
			return "No abstract avaliable for this paper.";
		}
		return abstract;
	}
	#getAuthors(authors) {
		return authors.slice(0, 10);
	}
}

export default SearchedPaper;
