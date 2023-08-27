import { jest } from "@jest/globals";
jest.mock("../../utils/generateIndexes", () => {
	return {
		__esModule: true,
		getPaperIndexesByCitationBoundry: jest.fn(() => {
			return [10, 20];
		}),
	};
});
import AuthorLogicParser from "../../logic/authorLogicParser";

import AuthorProfile from "../../classes/templates/AuthorProfile";
import SearchResultAuthor from "../../classes/templates/SearchResultAuthor";
import CoAuthor from "../../classes/templates/CoAuthor";
import PaperCitationData from "../../classes/PaperCitationData";

const mock_profile_data = {
	authorId: "144476960",
	name: "W. Pratt",
	aliases: ["W Pratt", "W. Pratt", "Wanda Pratt"],
	affiliations: [],
	homepage: null,
	paperCount: 205,
	citationCount: 8329,
	hIndex: 47,
	papers: [
		{
			paperId: "0db48fe5fabbcde89e595b720877277d77cfb502",
			title:
				"“Laughing so I dont cry”: How TikTok users employ humor and compassion to connect around psychiatric hospitalization",
			venue: "International Conference on Human Factors in Computing Systems",
			year: 2023,
			referenceCount: 95,
			citationCount: 0,
			fieldsOfStudy: ["Computer Science"],
			publicationTypes: ["JournalArticle", "Book", "Conference"],
			authors: [
				{
					authorId: "2089408187",
					name: "Anastasia Schaadhardt",
				},
				{
					authorId: "144476960",
					name: "W. Pratt",
				},
			],
		},
	],
};

//Chained to mock_profile_data.
const mock_search_result_data = {
	total: 1,
	offset: 0,
	data: [
		{
			authorId: mock_profile_data.authorId,
			name: mock_profile_data.name,
			aliases: mock_profile_data.aliases,
			affiliations: mock_profile_data.affiliations,
			homepage: mock_profile_data.homepage,
			paperCount: mock_profile_data.paperCount,
			hIndex: mock_profile_data.hIndex,
		},
	],
};

const mock_co_author_data = [
	{
		authorId: "8645671",
		name: "Sarah F. Worsley",
		paperCount: 32,
		citationCount: 589,
		hIndex: 8,
		papers: [
			{
				paperId: "6e40138eb2415edbcac449c358a3e443c1c3b0a8",
				title:
					"Assessing the causes and consequences of gut mycobiome variation in a wild population of the Seychelles warbler",
				citationCount: 0,
				influentialCitationCount: 0,
				s2FieldsOfStudy: [
					{
						category: "Biology",
						source: "s2-fos-model",
					},
				],
			},
		],
	},
	{
		authorId: "31890873",
		name: "M. Hutchings",
		paperCount: 114,
		citationCount: 5197,
		hIndex: 35,
		papers: [
			{
				paperId: "007c2d4bb1e0956ce7f6fc38ac1fcee26b2a3de7",
				title:
					"Evidence of a role for CutRS and actinorhodin in the secretion stress response in Streptomyces coelicolor M145",
				citationCount: 0,
				influentialCitationCount: 0,
				s2FieldsOfStudy: [
					{
						category: "Biology",
						source: "s2-fos-model",
					},
				],
			},
			{
				paperId: "d422dd47bdbe2c2b44fca2ba8d58847b4ca07ea8",
				title:
					"Heterologous Expression of the Formicamycin Biosynthetic Gene Cluster Unveils Glycosylated Fasamycin Congeners",
				citationCount: 0,
				influentialCitationCount: 0,
				s2FieldsOfStudy: [
					{
						category: "Biology",
						source: "s2-fos-model",
					},
					{
						category: "Chemistry",
						source: "s2-fos-model",
					},
				],
			},
		],
	},
];

const mock_citation_data = [
	{
		paperId: "f5c2e672c3812ca44b4a8be0e5b7d736225adf6a",
		citationCount: 3,
		authors: [
			{ authorId: "40408318", name: "M. Feeney" },
			{ authorId: "91090359", name: "J. Newitt" },
			{ authorId: "89026748", name: "Emily Addington" },
		],
		citations: [
			{
				paperId: "eeb4157dfc71a83cf49fe19d46bf25d56c64d9fa",
				authors: [{ authorId: "40408318", name: "M. Feeney" }],
			},
			{
				paperId: "007c2d4bb1e0956ce7f6fc38ac1fcee26b2a3de7",
				authors: [
					{ authorId: "91090359", name: "J. Newitt" },
					{ authorId: "89026748", name: "Emily Addington" },
				],
			},
			{
				paperId: "a106093c6f01c9582e443bcc689cb00c4bf7709d",
				authors: [{ authorId: "1", name: "fakename" }],
			},
		],
	},
];

describe("authorIdParser function", () => {
	it("should return proper author profile data", () => {
		expect(AuthorLogicParser.authorIdParser(mock_profile_data)).toEqual(
			expect.any(AuthorProfile)
		);
	});
});

describe("authorNameParser function", () => {
	it("should return proper searched scholar data for 1 result.", () => {
		expect(AuthorLogicParser.authorNameParser(mock_search_result_data)).toEqual(
			[expect.any(SearchResultAuthor)]
		);
	});
});

describe("authorPapersParser function", () => {
	it("should return proper paper citation data", () => {
		expect(
			AuthorLogicParser.authorPapersParser("1", mock_citation_data)
		).toEqual(expect.any(PaperCitationData));
	});
});

describe("authorCoAuthorParser function", () => {
	it("should return proper co_author data", () => {
		expect(AuthorLogicParser.authorCoAuthorParser(mock_co_author_data)).toEqual(
			{
				fields: ["Biology"],
				coAuthors: [expect.any(CoAuthor), expect.any(CoAuthor)],
			}
		);
	});
});
