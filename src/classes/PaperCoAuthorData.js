class PaperCoAuthorData {
	#keywordMap = new Map();
	constructor(apiDataPapers) {
		apiDataPapers.forEach((paper) => {
			this.#getKeywords(paper.s2FieldsOfStudy);
		});
		if (this.#keywordMap.size > 0) this.fieldsOfStudy = this.#SortKeywords();
	}
	#getKeywords(fieldsOfStudy) {
		fieldsOfStudy.forEach((keyword) => {
			keyword = keyword.category;
			const payload = this.#keywordMap.get(keyword);
			if (payload) {
				this.#keywordMap.set(keyword, payload + 1);
			} else {
				this.#keywordMap.set(keyword, 1);
			}
		});
	}
	#SortKeywords() {
		this.#keywordMap = new Map(
			[...this.#keywordMap.entries()].sort((a, b) => b[1] - a[1])
		);
		return Array.from(this.#keywordMap).at(0)[0];
	}
}
export default PaperCoAuthorData;
