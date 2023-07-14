class PaperCoAuthorData {
	#keywordMap = new Map();
	#fieldsOfStudy = [];
	constructor(apiDataPapers, fieldsOfStudy) {
		this.#fieldsOfStudy = fieldsOfStudy;
		apiDataPapers.forEach((paper) => {
			this.#getKeywords(paper.s2FieldsOfStudy);
		});
		this.fieldsOfStudy = this.#SortKeywords();
		this.inTheSameArea = this.#isInTheSameArea();
	}
	#getKeywords(fieldsOfStudy) {
		if (!fieldsOfStudy) return;
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
		return Array.from(this.#keywordMap).at(0);
	}
	#isInTheSameArea() {
		let status = false;
		if(!this.fieldsOfStudy) return status;

		this.#fieldsOfStudy.forEach((field) => {
			if (field[0] == this.fieldsOfStudy[0]) {
				status = true;
				return;
			}
		});
		return status;
	}
}
export default PaperCoAuthorData;
