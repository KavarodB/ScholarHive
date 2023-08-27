import PaperLogicParser from "../../logic/paperLogicParser";
import SearchedPaper from "../../classes/SearchedPaper";

const mock_input_data = {
	total: 122,
	offset: 0,
	next: 100,
	data: [
		{
			paperId: "9a1210a794670f7b13add9ab9e4d038f0529ca4a",
			title: "Virological assessment of hospitalized patients with COVID-2019",
			abstract: null,
			venue: "Nature",
			year: 2020,
			citationCount: 5875,
			openAccessPdf: {
				url: "https://www.nature.com/articles/s41586-020-2196-x.pdf",
				status: "BRONZE",
			},
			fieldsOfStudy: ["Medicine"],
			s2FieldsOfStudy: [
				{
					category: "Medicine",
					source: "external",
				},
				{
					category: "Medicine",
					source: "s2-fos-model",
				},
			],
			publicationTypes: ["JournalArticle"],
			authors: [
				{
					authorId: "3668245",
					name: "R. Wölfel",
				},
				{
					authorId: "4879621",
					name: "V. Corman",
				},
				{
					authorId: "5616649",
					name: "W. Guggemos",
				},
			],
		},
	],
};

describe("searchPapersParser function", () => {
	it("should parse 2 papers properly", () => {
		expect(PaperLogicParser.searchPapersParser(mock_input_data)).toEqual({
			totalFound: 122,
			results: [expect.any(SearchedPaper)],
		});
	});
});
