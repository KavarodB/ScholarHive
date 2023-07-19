import axios from "axios";

//API key setup.
const http = axios.create({
	headers: {
		post: {
			"x-api-key": "mFQECsLNvS3JlaWd9nS7Ya9vG8EHKpoG6XUBQqsK",
		},
	},
});

const SemanticScholar = {
	getAuthorByName: (authorname) => {
		const authorFields =
			"fields=name,aliases,affiliations,homepage,paperCount,hIndex";
		const authorLimit = "limit=40";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(
			authorname
		)}&${authorFields}&${authorLimit}`;
		return http.get(apiUrl);
	},
	getAuthorById: (authorId) => {
		const authorFields =
			"fields=name,aliases,affiliations,homepage,paperCount,citationCount,hIndex,papers.title,papers.venue,papers.year,papers.authors,papers.referenceCount,papers.citationCount,papers.fieldsOfStudy,papers.publicationTypes";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}?${authorFields}`;
		return http.get(apiUrl);
	},
	getAuthorsPaper: (authorId) => {
		const paperFields =
			"fields=citationCount,citations.paperId,citations.authors,references.paperId,references.authors&limit=700";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?${paperFields}`;
		return http.get(apiUrl);
	},
	getPaperByQuery: (query, filters) => {
		const paperFields =
			"fields=title,venue,year,authors,abstract,citationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes&limit=100";
		//API URL
		let apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
			query
		)}&${paperFields}`;
		if (filters) {
			let yearquery = "";
			let fieldofstudy = "";
			//If it has field of study
			if (filters.fieldsOfStudy) {
				fieldofstudy += "&fieldsOfStudy=" + filters.fieldsOfStudy;
			}
			//If it has the two years, else what ever year it has.
			if (filters.startyear && filters.endyear) {
				yearquery += "&year=" + filters.startyear + "-" + filters.endyear;
			} else if (filters.startyear) {
				yearquery += "&year=" + filters.startyear + "-";
			} else if (filters.endyear) {
				yearquery += "&year=" + "-" + filters.endyear;
			}
			//API URL construction
			apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
				query
			)}${yearquery}${fieldofstudy}&${paperFields}`;
		}
		return http.get(apiUrl);
	},
	postMultipleAuthors: (coauthorIds) => {
		const coAuthorFields =
			"fields=name,paperCount,citationCount,hIndex,papers,papers.title,papers.citationCount,papers.influentialCitationCount,papers.s2FieldsOfStudy";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/batch?${coAuthorFields}`;
		return http.post(apiUrl, { ids: coauthorIds });
	},
};

export default SemanticScholar;
