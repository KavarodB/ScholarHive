import { jest } from "@jest/globals";
jest.mock("../../models/semanticScholarAPI");
import AuthorController from "../../controllers/AuthorController.js";
import SemanticScholar from "../../models/semanticScholarAPI";
import LRUCacheHandler from "../../utils/lruCacheHandler";

jest.spyOn(LRUCacheHandler.prototype, "get").mockImplementation(() => false);
jest.spyOn(LRUCacheHandler.prototype, "set").mockImplementation(() => {});

const request = {
	body: {
		authorname: "fakename",
		authorId: "1",
	},
};

const response = {
	end: jest.fn((x) => x),
	json: jest.fn((x) => x),
	status: jest.fn((x) => x),
};

const authorCon = new AuthorController();

afterEach(() => {
	jest.clearAllMocks();
});

describe("authorByName function", () => {
	it("should send valid results for valid author name", async () => {
		SemanticScholar.getAuthorByName = jest.fn().mockResolvedValue({
			total: 1,
			offset: 0,
			data: [
				{
					authorId: "144476960",
					name: "W. Pratt",
					aliases: ["W Pratt", "W. Pratt", "Wanda Pratt"],
					affiliations: [],
					homepage: null,
					paperCount: 205,
					hIndex: 47,
				},
			],
		});
		const resdata = {
			authorId: "144476960",
			name: "W. Pratt",
			aliases: ["W Pratt", "W. Pratt", "Wanda Pratt"],
			affiliations: [],
			homepage: null,
			paperCount: 205,
			hIndex: 47,
		};
		await authorCon.authorByName(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith([resdata]);
	});
});

describe("authorById function", () => {
	it("should get valid information about author", async () => {
		SemanticScholar.getAuthorById = jest.fn().mockResolvedValue({
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
					venue:
						"International Conference on Human Factors in Computing Systems",
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
							authorId: "2118638166",
							name: "Yue Fu",
						},
						{
							authorId: "2214760024",
							name: "Cory Gennari Pratt",
						},
						{
							authorId: "144476960",
							name: "W. Pratt",
						},
					],
				},
			],
		});
		const resdata = {
			authorId: "144476960",
			name: "W. Pratt",
			aliases: ["W Pratt", "W. Pratt", "Wanda Pratt"],
			affiliations: [],
			homepage: null,
			paperCount: 205,
			citationCount: 8329,
			hIndex: 47,
			index: [1],
			paperData: {
				fieldsOfStudy: [["Computer Science", 1]],
				activeYears: [[2023, 1]],
				coauthors: [],
				coauthorIds: [],
				mostCited: [
					{
						paperId: "0db48fe5fabbcde89e595b720877277d77cfb502",
						title:
							"“Laughing so I dont cry”: How TikTok users employ humor and compassion to connect around psychiatric hospitalization",
						venue:
							"International Conference on Human Factors in Computing Systems",
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
								authorId: "2118638166",
								name: "Yue Fu",
							},
							{
								authorId: "2214760024",
								name: "Cory Gennari Pratt",
							},
							{
								authorId: "144476960",
								name: "W. Pratt",
							},
						],
					},
				],
				citationCount: 0,
			},
		};
		await authorCon.authorById(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});
});

describe("authorPapers functions", () => {
	it("should give paper data stored already in cache", async () => {
		SemanticScholar.getAuthorsPaperOffset = jest.fn().mockRejectedValue({});
		jest.spyOn(LRUCacheHandler.prototype, "get").mockImplementationOnce(() => {
			return {
				authorId: "1",
				totalCitations: 25706,
				selfCitationCount: 83,
				selfRefrenceCount: 895,
				selfCitationRate: 3.482,
			};
		});
		const resdata = {
			authorId: "1",
			totalCitations: 25706,
			selfCitationCount: 83,
			selfRefrenceCount: 895,
			selfCitationRate: 3.482,
		};
		await authorCon.authorPapers(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});

	it("should not allow for unvisited scholar to get paper information", async () => {
		SemanticScholar.getAuthorsPaperOffset = jest.fn().mockRejectedValue({});
		const resdata = {
			message: "Error: Retrieving the indexes for scholar  1",
		};
		await authorCon.authorPapers(request, response);
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});

	it("should allow for already visited scholar to get paper information", async () => {
		SemanticScholar.getAuthorsPaperOffset = jest.fn().mockResolvedValueOnce({
			data: [
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
			],
		});
		jest
			.spyOn(LRUCacheHandler.prototype, "get")
			.mockImplementationOnce(() => {
				false;
			})
			.mockImplementationOnce(() => {
				return {
					index: [20],
				};
			});
		const resdata = {
			authorId: "1",
			totalCitations: 3,
			selfCitationCount: 1,
			coAuthorCitationCount: 2,
			selfCitationRate: 33.3,
			coCitationRate: 66.7,
		};
		await authorCon.authorPapers(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});

	it("should throw an error when cache does not have index field saved", async () => {
		SemanticScholar.getAuthorsPaperOffset = jest.fn().mockRejectedValue({});
		jest
			.spyOn(LRUCacheHandler.prototype, "get")
			.mockImplementationOnce(() => {
				false;
			})
			.mockImplementationOnce(() => {
				return {
					foo: "bar",
				};
			});
		const resdata = {
			message: "Cannot read properties of undefined (reading 'length')",
		};
		await authorCon.authorPapers(request, response);
		expect(response.status).toHaveBeenCalledWith(500);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});
});

describe("authorCoAuthors function", () => {
	it("should not allow for unvisited scholar to get coauthor information", async () => {
		SemanticScholar.postMultipleAuthors = jest.fn().mockRejectedValue({});
		const resdata = {
			message: "Error: Retrieving the list of coauthors for scholar 1",
		};
		await authorCon.authorCoAuthors(request, response);
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});

	it("should allow for visited scholar to get coauthor information", async () => {
		SemanticScholar.postMultipleAuthors = jest.fn().mockResolvedValueOnce([
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
		]);
		jest.spyOn(LRUCacheHandler.prototype, "get").mockImplementationOnce(() => {
			return { paperData: { coauthorIds: ["8645671", "31890873"] } };
		});
		const resdata = {
			coAuthors: [
				{
					authorId: "31890873",
					name: "M. Hutchings",
					paperCount: 114,
					citationCount: 5197,
					hIndex: 35,
					paperData: {
						fieldsOfStudy: "Biology",
					},
				},
				{
					authorId: "8645671",
					name: "Sarah F. Worsley",
					paperCount: 32,
					citationCount: 589,
					hIndex: 8,
					paperData: {
						fieldsOfStudy: "Biology",
					},
				},
			],
			fields: ["Biology"],
		};

		await authorCon.authorCoAuthors(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith(resdata);
		expect(response.end).toHaveBeenCalledTimes(1);
	});

	it("should throw an error when API fails to get coauthor information", async () => {
		SemanticScholar.postMultipleAuthors = jest.fn().mockRejectedValueOnce();
		jest.spyOn(LRUCacheHandler.prototype, "get").mockImplementationOnce(() => {
			return { paperData: { coauthorIds: ["8645671", "31890873"] } };
		});
		const resdata = {
			message: "Error: Retrieving the list of coauthors for scholar 1",
		};
		await authorCon.authorCoAuthors(request, response);
		expect(response.status).toHaveBeenCalledWith(500);
		expect(response.json).toHaveBeenCalledWith(resdata);
	});
});

describe("authorCompare function", () => {
	it("should throw an error if there is not scholarList in request body ", async () => {
		await authorCon.authorCompare(request, response);
		expect(response.status).toHaveBeenCalledWith(500);
		expect(response.json).toHaveBeenCalledWith({
			message: "Error: Cannot read properties of undefined (reading 'filter')",
		});
	});

	it("should separate already passed from to-be-requested citation data", async () => {
		SemanticScholar.getAuthorsPaperOffset = jest.fn().mockResolvedValue({
			data: [
				{
					paperId: "f5c2e672c3812ca44b4a8be0e5b7d736225adf6a",
					citationCount: 3,
					authors: [
						{ authorId: "50095086", name: "M. Feeney" },
						{ authorId: "91090359", name: "J. Newitt" },
						{ authorId: "89026748", name: "Emily Addington" },
					],
					citations: [
						{
							paperId: "eeb4157dfc71a83cf49fe19d46bf25d56c64d9fa",
							authors: [{ authorId: "50095086", name: "M. Feeney" }],
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
			],
		});
		let request_mod = request;
		request_mod.body.scholarList = [
			{
				authorId: "145991349",
				hasCitationData: true,
				citationData: {
					authorId: "145991349",
					totalCitations: 25706,
					selfCitationCount: 83,
					selfRefrenceCount: 895,
					selfCitationRate: 3.482,
				},
			},
			{
				authorId: "50095086",
				hasCitationData: false,
				index: [20, 23, 32, 45],
			},
		];
		const res_data = [
			{
				authorId: "145991349",
				totalCitations: 25706,
				selfCitationCount: 83,
				selfRefrenceCount: 895,
				selfCitationRate: 3.482,
			},
			{
				authorId: "50095086",
				totalCitations: 12,
				selfCitationCount: 4,
				coAuthorCitationCount: 4,
				selfCitationRate: 33.3,
				coCitationRate: 33.3,
			},
		];
		await authorCon.authorCompare(request_mod, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith(res_data);
		expect(response.end).toHaveBeenCalledTimes(1);
	});
});

describe("checkSigniture function", () => {
	const next = jest.fn();

	it("should reject for invalid valid path", async () => {
		const request_mod = {
			originalUrl: "/author/brummmm",
		};
		authorCon.checkSigniture(request_mod, response, next);
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith({
			message: "Error: Request body should not be empty.",
		});
	});

	it("should reject for valid path but invalid body", async () => {
		const request_mod = {
			originalUrl: "/author/id",
			body: {
				invalid: "nope@",
			},
		};
		authorCon.checkSigniture(request_mod, response, next);
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith({
			message: "Error: Request body should have property authorId",
		});
	});

	it("should accept for valid path and body", async () => {
		const request_mod = {
			originalUrl: "/author/id",
			body: {
				authorId: "1",
			},
		};
		authorCon.checkSigniture(request_mod, response, next);
		expect(response.end).toHaveBeenCalledTimes(0);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
