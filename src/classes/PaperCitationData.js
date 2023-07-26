class PaperCitationData {
	#authorId = "null";
	#coauthorIds = [];

	constructor(authorId, coauthorIds = [], apiPaperData) {
		this.#authorId = authorId;
		this.#coauthorIds = coauthorIds;
		this.totalCitations = 0;
		this.selfCitationCount = 0;
		if (this.#coauthorIds.length != 0) this.coAuthorCitationCount = 0;

		const papers = apiPaperData;
		papers.forEach((paper) => {
			this.#getPaperCitation(paper.citations);
			this.#getTotalCitationCount(paper.citationCount);
		});
		this.selfCitationRate = this.#calculateSelfCitationRate();

		if (this.#coauthorIds.length != 0)
			this.coCitationRate = this.#calculateCoCitationRate();
	}
	#getPaperCitation(citations) {
		if (!citations) return;
		citations.forEach((citation) => {
			if (citation.paperId) {
				citation.authors.forEach((author) => {
					const authorId = author.authorId;
					if (authorId == this.#authorId) {
						this.selfCitationCount++;
					}
					if (this.#coauthorIds.includes(author.authorId))
						this.coAuthorCitationCount++;
				});
			}
		});
	}
	#getTotalCitationCount(citationCount) {
		if (citationCount) this.totalCitations += citationCount;
	}
	#calculateSelfCitationRate() {
		let selfcitationrate = 0;
		let divider = this.selfCitationCount;
		selfcitationrate = (this.totalCitations / divider).toPrecision(11);
		selfcitationrate = 100 / selfcitationrate;

		return Number.parseFloat(selfcitationrate.toPrecision(3));
	}
	#calculateCoCitationRate() {
		let cocitationrate = 0;
		let divider = this.coAuthorCitationCount;
		cocitationrate = (this.totalCitations / divider).toPrecision(11);
		cocitationrate = 100 / cocitationrate;

		return Number.parseFloat(cocitationrate.toPrecision(3));
	}
}
export default PaperCitationData;
