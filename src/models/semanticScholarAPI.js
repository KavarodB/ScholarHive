import axios from "axios";

const SemanticScholar = {
	getAuthorByName: (authorname) => {
		const authorFields =
			"fields=name,aliases,affiliations,homepage,paperCount,hIndex";
		const authorLimit = "limit=40";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(
			authorname
		)}&${authorFields}&${authorLimit}`;
		return axios.get(apiUrl);
	},
	getAuthorById: (authorId) => {
		const authorFields =
			"fields=name,aliases,affiliations,homepage,paperCount,citationCount,hIndex,papers.title,papers.venue,papers.year,papers.authors,papers.referenceCount,papers.citationCount,papers.fieldsOfStudy,papers.publicationTypes";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}?${authorFields}`;
		return axios.get(apiUrl);
	},
	getAuthorsPaper: (authorId) => {
		const paperFields =
			"fields=citationCount,citations.paperId,citations.authors,references.paperId,references.authors&limit=700";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?${paperFields}`;
		return axios.get(apiUrl);
	},
	getPaperByQuery: (query, filters) => {
		const paperFields =
			"fields=title,venue,year,authors,abstract,citationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes&limit=100";
		//API URL
		let apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&${paperFields}`;
		if (filters) {
			let yearquery = "&year=";
			let fieldofstudy = "&fieldsOfStudy=";
			if (filters.startyear && filters.endyear) {
				yearquery += filters.startyear + "-" + filters.endyear;
			} else if (filters.startyear) {
				yearquery += filters.startyear + "-";
			} else if (filters.endyear) {
				yearquery += "-" + filters.endyear;
			}
			if (filters.fieldsOfStudy) {
				fieldofstudy += filters.fieldsOfStudy;
			}
			//API URL
			apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}${yearquery}${fieldofstudy}&${paperFields}`;
		}
		return axios.get(apiUrl);
	},
};

export default SemanticScholar;
