class SearchResultAuthor {
	constructor(authorData) {
		const {
			authorId,
			name,
			paperCount,
			citationCount,
			hIndex,
			aliases,
			affiliations,
			homepage,
		} = authorData;
		this.authorId = authorId;
		this.name = name;
		this.paperCount = paperCount;
		this.citationCount = citationCount;
		this.hIndex = hIndex;
		this.aliases = aliases;
		this.affiliations = affiliations;
		this.homepage = homepage;
	}
}
export default SearchResultAuthor;
