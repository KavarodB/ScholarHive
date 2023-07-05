class PaperCitationData {
	#authorId = "null";
	constructor(authorId, apiPaperData) {
		this.totalCitations = 0;
		this.selfCitationCount = 0;
		this.selfRefrenceCount = 0;
		this.#authorId = authorId;
		const papers = apiPaperData;
		papers.forEach((paper) => {
			this.#getPaperCitation(paper.citations);
			this.#getPaperRefrence(paper.references);
			this.#getTotalCitationCount(paper.citationCount);
		});
		this.selfCitationRate = this.#calculateSelfCitationRate();
	}
	#getPaperCitation(citations) {
		if (!citations) return;
		citations.forEach((citation) => {
			if (citation.paperId) {
				citation.authors.forEach((author) => {
					if (author.authorId == this.#authorId) {
						this.selfCitationCount++;
					}
				});
			}
		});
	}
	#getPaperRefrence(references) {
		if (!references) return;
		references.forEach((reference) => {
			if (reference.paperId) {
				reference.authors.forEach((author) => {
					if (author.authorId == this.#authorId) {
						this.selfRefrenceCount++;
					}
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
		if (this.selfCitationCount != this.selfRefrenceCount) {
			divider = Math.max(this.selfCitationCount, this.selfRefrenceCount);
		}
		selfcitationrate = (this.totalCitations / divider).toPrecision(11);
		selfcitationrate = 100 / selfcitationrate;

		return Number.parseFloat(selfcitationrate.toPrecision(4));
	}
}
export default PaperCitationData;
