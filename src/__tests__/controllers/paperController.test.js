import { jest } from "@jest/globals";
jest.mock("../../models/semanticScholarAPI");
import PaperController from "../../controllers/PaperController";
import SemanticScholar from "../../models/semanticScholarAPI";

const request = {
	body: {
		query: "3D-Graphics",
		filters: {
			fieldsOfStudy: "Biology",
			startyear: "2020",
			endyear: "2021",
		},
	},
};

const response = {
	end: jest.fn((x) => x),
	json: jest.fn((x) => x),
	status: jest.fn((x) => x)
};

const paperCon = new PaperController();

afterEach(() => {
	jest.clearAllMocks();
});

describe("searchPapers function", () => {
	it("should throw an error if query and filters are not present in request body", async () => {
		await paperCon.searchPapers({}, response);
		expect(response.status).toHaveBeenCalledWith(500);
		expect(response.json).toHaveBeenCalledWith({
			message: "API Error: Retrieving papers.",
		});
	});
	it("should return mocked but correctly parsed paper results", async () => {
		SemanticScholar.getPaperByQuery = jest.fn().mockResolvedValue({
			total: 122,
			offset: 0,
			next: 100,
			data: [
				{
					paperId: "9a1210a794670f7b13add9ab9e4d038f0529ca4a",
					title:
						"Virological assessment of hospitalized patients with COVID-2019",
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
		});
		await paperCon.searchPapers(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledWith({
			totalFound: 122,
			results: [
				{
					paperId: "9a1210a794670f7b13add9ab9e4d038f0529ca4a",
					title:
						"Virological assessment of hospitalized patients with COVID-2019",
					abstract: "No abstract avaliable for this paper.",
					venue: "Nature",
					year: 2020,
					citationCount: 5875,
					openAccessPdf: {
						url: "https://www.nature.com/articles/s41586-020-2196-x.pdf",
						status: "BRONZE",
					},
					fieldsOfStudy: ["Medicine"],
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
		});
		expect(response.end).toHaveBeenCalledTimes(1);
	});
	it("should return rejected promise mocked paper results", async () => {
		SemanticScholar.getPaperByQuery = jest.fn().mockRejectedValue();
		await paperCon.searchPapers(request, response);
		expect(response.status).toHaveBeenCalledWith(500);
		expect(response.json).toHaveBeenCalledWith({
			message: "API Error: Retrieving papers.",
		});
		expect(response.end).toHaveBeenCalledTimes(1);
	});
});

describe("checkSigniture function", () => {
	const next = jest.fn();

	it("should reject for invalid valid path", async () => {
		const request_mod = {
			originalUrl: "/paper/brummmm",
		};
		paperCon.checkSigniture(request_mod, response, next);
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith({
			message: "Error: Request body should not be empty.",
		});
	});

	it("should reject for valid path but invalid body", async () => {
		const request_mod = {
			originalUrl: "/paper/search",
			body: {
				invalid: "nope!",
			},
		};
		paperCon.checkSigniture(request_mod, response, next);
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith({
			message: "Error: Request body should have property query",
		});
	});

	it("should accept for valid path and body", async () => {
		const request_mod = {
			originalUrl: "/paper/search",
			body: {
				query: "test_query",
			},
		};
		paperCon.checkSigniture(request_mod, response, next);
		expect(response.end).toHaveBeenCalledTimes(0);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
