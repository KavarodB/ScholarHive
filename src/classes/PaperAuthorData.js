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
		this.citationCount = this.mostCited
			.map((paper) => paper.citationCount)
			.reduce((result, value) => (result += value), 0);
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
		if (!authors || authors.length == 0) return;
		authors.forEach((author) => {
			if (author.authorId != this.#authorId) {
				//Map author name to contributed papers.
				const payload = this.#coauthorMap.get(author.name);
				if (payload) {
					this.#coauthorMap.set(author.name, payload + 1);
				} else {
					this.#coauthorMap.set(author.name, 1);
					if (!this.#coauthorNameMap.get(author.name))
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
		const coauthor_treshhold = 5;
		//Remove "accidental coauthors" and sort by descending
		this.#coauthorMap = new Map(
			[...this.#coauthorMap.entries()]
				.filter(([k, v]) => v >= coauthor_treshhold)
				.sort((a, b) => b[1] - a[1])
		);
		//Coauthors -> binding name with id
		let coauthorArray = Array.from(this.#coauthorMap.keys());
		let coauthorIds = [];
		const coAuthorLength = coauthorArray.length;
		for (let index = 0; index < coAuthorLength; index++) {
			const name = coauthorArray.shift();
			const id = this.#coauthorNameMap.get(name);
			coauthorIds.push(id);
		}
		return {
			coauthors: Array.from(this.#coauthorMap),
			coauthorIds: coauthorIds,
		};
	}
	#SortYears() {
		//Sort years by decending.
		return Array.from(this.#yearMap).sort((a, b) => {
			return a[0] > b[0] ? -1 : 1;
		});
	}
	#SortPapers(papers) {
		//Sort papers by most citations without mutating them.
		return [...papers].sort((a, b) =>
			a.citationCount > b.citationCount ? -1 : 1
		);
	}
}
export default PaperAuthorData;
