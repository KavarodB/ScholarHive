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
	getAuthorByName: async (authorname) => {
		const authorFields =
			"fields=name,aliases,affiliations,homepage,paperCount,hIndex";
		const authorLimit = "limit=35";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(
			authorname
		)}&${authorFields}&${authorLimit}`;
		const response = await http.get(apiUrl);
		return response.data;
	},
	getAuthorById: async (authorId) => {
		const authorFields =
			"fields=name,aliases,affiliations,homepage,paperCount,citationCount,hIndex,papers.title,papers.venue,papers.year,papers.authors,papers.referenceCount,papers.citationCount,papers.fieldsOfStudy,papers.publicationTypes";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}?${authorFields}`;
		const response = await http.get(apiUrl);
		return response.data;
	},
	//@Deprecated.
	getAuthorsPaper: async (authorId, limit) => {
		//Limit reset.
		if (limit == null || limit > 700) limit = 500;
		const paperFields = `fields=citationCount,authors,citations.authors&limit=${limit}`;
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?${paperFields}`;
		const response = await http.get(apiUrl);
		return response.data;
	},
	getAuthorsPaperOffset: async (authorId, limit, offset) => {
		//Limit reset.
		if (limit == null || limit > 500) limit = 500;
		const paperFields = `fields=citationCount,authors,citations.authors&limit=${limit}&offset=${offset}`;
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?${paperFields}`;
		const response = await http.get(apiUrl);
		return response.data;
	},
	getPaperByQuery: async (query, filters) => {
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
		const response = await http.get(apiUrl);
		return response.data;
	},
	postMultipleAuthors: async (coauthorIds) => {
		const coAuthorFields =
			"fields=name,paperCount,citationCount,hIndex,papers,papers.title,papers.citationCount,papers.influentialCitationCount,papers.s2FieldsOfStudy";
		//API URL
		const apiUrl = `https://api.semanticscholar.org/graph/v1/author/batch?${coAuthorFields}`;
		const response = await http.post(apiUrl, { ids: coauthorIds });
		return response.data;
	},
};

export default SemanticScholar;
