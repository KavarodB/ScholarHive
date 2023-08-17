class PaperCitationData {
	constructor(authorId, apiPaperData) {
		this.authorId = authorId;
		this.totalCitations = 0;
		this.selfCitationCount = 0;
		this.coAuthorCitationCount = 0;
		apiPaperData.forEach((paper) => {
			if (paper.paperId == null || paper.citationCount != 0)
				this.#getPaperCitation(paper.citations, paper.authors);
		});
		this.selfCitationRate = this.#calculateSelfCitationRate();
		this.coCitationRate = this.#calculateCoCitationRate();
	}
	#getPaperCitation(citations, authors) {
		if (authors.length == 0) return;
		citations.forEach((citation) => {
			this.totalCitations++;
			const self = citation.authors
				.map((author) => author.authorId)
				.includes(this.authorId);
			if (self) {
				this.selfCitationCount++;
				return;
			}
			const cit_authors = citation.authors.map((author) => author.authorId);
			const coauthors = authors.map((author) => author.authorId);
			const found = cit_authors.some((author) => coauthors.includes(author));
			if (found) {
				this.coAuthorCitationCount++;
				return;
			}
		});
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
