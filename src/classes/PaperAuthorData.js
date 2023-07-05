class PaperAuthorData {
	#keywordMap = new Map();
	#coauthorMap = new Map();
	#coauthorNameMap = new Map();
	#yearMap = new Map();
	#authorId = "null";
	constructor(authorId, apiDataPapers) {
		this.#authorId = authorId;
		apiDataPapers.forEach((paper) => {
			this.#getKeywords(paper.fieldsOfStudy);
			this.#getCoAuthors(paper.authors);
			this.#getActiveYears(paper.year);
		});
		this.fieldsOfStudy = this.#SortKeywords();
		this.activeYears = this.#SortYears();
		const { coauthors, coauthorIds } = this.#SortCoauthors();
		this.coauthors = coauthors;
		this.coauthorIds = coauthorIds;
		this.mostCited = this.#SortPapers(apiDataPapers);
	}
	toConsole(){
		console.log("Object:",this);
	}
	#getKeywords(fieldsOfStudy) {
		if (!fieldsOfStudy) return;
		fieldsOfStudy.forEach((keyword) => {
			if (this.#keywordMap.get(keyword)) {
				this.#keywordMap.set(keyword, this.#keywordMap.get(keyword) + 1);
			} else {
				this.#keywordMap.set(keyword, 1);
			}
		});
	}
	#getCoAuthors(authors) {
		if (!authors || authors.length==0) return;
		authors.forEach((author) => {
			if (author.authorId != this.#authorId) {
				if (this.#coauthorMap.get(author.name)) {
					this.#coauthorMap.set(
						author.name,
						this.#coauthorMap.get(author.name) + 1
					);
				} else {
					this.#coauthorMap.set(author.name, 1);
					this.#coauthorNameMap.set(author.name, author.authorId);
				}
			}
		});
	}
	#getActiveYears(year) {
		if (year == null || year == undefined) return;
		if (this.#yearMap.get(year)) {
			this.#yearMap.set(year, this.#yearMap.get(year) + 1);
		} else {
			this.#yearMap.set(year, 1);
		}
	}
	#SortKeywords() {
		this.#keywordMap = new Map(
			[...this.#keywordMap.entries()].sort((a, b) => b[1] - a[1])
		);
		return Array.from(this.#keywordMap);
	}
	#SortCoauthors() {
		//Sort by descending.
		this.#coauthorMap = new Map(
			[...this.#coauthorMap.entries()].sort((a, b) => b[1] - a[1])
		);
		//Coauthors -> binding name with id
		let coauthorArray = Array.from(this.#coauthorMap.keys());
		let coauthorIds = [];
		for (let index = 0; index < Math.min(coauthorArray.length, 15); index++) {
			const name = coauthorArray.shift();
			const id = this.#coauthorNameMap.get(name);
			coauthorIds.push(id);
		}

		return {
			coauthors: Array.from(this.#coauthorMap).slice(0, 15),
			coauthorIds: coauthorIds,
		};
	}
	#SortYears() {
		return Array.from(this.#yearMap);
	}
	#SortPapers(papers) {
		//Sort papers by most citations
		// and return the first 3.
		return papers
			.sort((a, b) => (a.citationCount > b.citationCount ? -1 : 1))
			.slice(0, 3);
	}
}
export default PaperAuthorData;