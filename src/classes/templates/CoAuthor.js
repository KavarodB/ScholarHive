class CoAuthor {
	constructor(paperData, authorData) {
		const {
			authorId,
			name,
			paperCount,
			citationCount,
			hIndex,
		} = authorData;
		this.authorId = authorId;
		this.name = name;
		this.paperCount = paperCount;
		this.citationCount = citationCount;
		this.hIndex = hIndex;
		this.paperData = paperData;
	}
}

export default CoAuthor;
