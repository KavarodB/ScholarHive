class AuthorProfile {
	constructor(indexes, paperData, authorData) {
		const {
			authorId,
			name,
			aliases,
			affiliations,
			homepage,
			paperCount,
			citationCount,
			hIndex,
		} = authorData;
		this.authorId = authorId;
		this.name = name;
		this.aliases = aliases;
		this.affiliations = affiliations;
		this.homepage = homepage;
		this.paperCount = paperCount;
		this.citationCount = citationCount;
		this.hIndex = hIndex;
		this.index = indexes;
		this.paperData = paperData;
	}
}

export default AuthorProfile;
