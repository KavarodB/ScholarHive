import semanticScholar from "../models/semanticScholarAPI.js";
import AuthorLogicParser from "../logic/authorLogicParser.js";
import AbstractController from "./AbstractController.js";
import isEmptyObject from "../utils/isEmpty.js";
import LRUCacheHandler from "../utils/LRUcacheHandler.js";

const cacheHandler = new LRUCacheHandler();
const cacheCitations = new LRUCacheHandler();

class AuthorController extends AbstractController {
	async authorByName(req, res) {
		try {
			const data = await semanticScholar.getAuthorByName(req.body.authorname);
			const parsed = AuthorLogicParser.authorNameParser(data);
			res.json(parsed);
			res.end();
		} catch (error) {
			// Handle specific error cases
			if (error.response && error.response.status === 404) {
				res
					.status(404)
					.json({ message: "Error: Author with that name can not found" });
			} else if (error.code === "ENOTFOUND") {
				res
					.status(500)
					.json({ message: "Error: Failed to connect to the API" });
			} else {
				res.status(500).json({ message: "Error: Something went wrong" });
			}
		}
	}

	async authorById(req, res) {
		const authorId = req.body.authorId;
		const found = cacheHandler.get(authorId);
		if (found) {
			res.json(found).end();
			return;
		}
		try {
			const data = await semanticScholar.getAuthorById(authorId);
			const parsed = AuthorLogicParser.authorIdParser(data);
			cacheHandler.set(authorId, parsed);
			res.json(parsed).end();
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async authorPapers(req, res) {
		const { authorId } = req.body;
		const found_cit = cacheCitations.get(authorId);
		if (found_cit) {
			res.json(found_cit).end();
			return;
		}
		try {
			const found = cacheHandler.get(authorId);
			let limit = null;
			if (found) limit = found.index;
			const data = await semanticScholar.getAuthorsPaper(authorId, limit);
			const parsed = AuthorLogicParser.authorPapersParser(authorId, data);
			cacheCitations.set(authorId, parsed);
			res.json(parsed).end();
		} catch (error) {
			res.status(500).send({
				message: error.message,
			});
		}
	}

	async authorCoAuthors(req, res) {
		const { authorId } = req.body;
		const found = cacheHandler.get(authorId);
		let coauthorIds = [];
		if (found) {
			//100 most relevent coauthors. sorted from previous call.
			coauthorIds = found.paperData.coauthorIds.slice(0, 100);
		} else {
			res.status(500).send({
				message:
					"Error: Retrieving the list of coauthors for scholar  " + authorId,
			});
			return;
		}
		try {
			const data = await semanticScholar.postMultipleAuthors(coauthorIds);
			const parsed = AuthorLogicParser.authorCoAuthorParser(data);
			res.json(parsed).end();
		} catch (error) {
			res.status(500).send({
				message:
					"Error: Retrieving the list of coauthors for scholar " + authorId,
			});
		}
	}

	async authorCompare(req, res) {
		const scholarList = req.body.scholarList;
		try {
			const toBeRequested = scholarList.filter(
				(entry) => entry.hasCitationData == false
			);
			const toBeLeft = scholarList
				.filter((entry) => entry.hasCitationData == true)
				.map((entry) => entry.citationData);

			// Use Promise.all to make multiple API requests asynchronously
			const authorDataPromises = toBeRequested.map((author) =>
				semanticScholar.getAuthorsPaper(author.authorId, author.index)
			);

			const authorDataResults = await Promise.all(authorDataPromises);
			const citationDataResults = authorDataResults.map((result, index) => {
				const data = AuthorLogicParser.authorPapersParser(
					toBeRequested[index].authorId,
					result
				);
				cacheCitations.set(toBeRequested[index].authorId, data);
				return data;
			});
			citationDataResults.push(...toBeLeft);
			res.json(citationDataResults);
		} catch (error) {
			res.status(500).json({ message: "Error: " + error.message });
		}
	}

	checkSigniture(req, res, next) {
		if (isEmptyObject(req.body)) {
			res
				.status(400)
				.send({ message: "Error: Request body should not be empty." })
				.end();
			return;
		}
		switch (req.originalUrl) {
			case "/author/search":
				if (!req.body.authorname) {
					res
						.status(400)
						.send({
							message: "Error: Request body should have property authorname",
						})
						.end();
					return;
				}
				break;
			case "/author/id":
				if (!req.body.authorId) {
					res
						.status(400)
						.send({
							message: "Error: Request body should have property authorId",
						})
						.end();
					return;
				}
				break;
			case "/author/citations":
				if (!req.body.authorId) {
					res
						.status(400)
						.send({
							message: "Error: Request body should have property authorId",
						})
						.end();
					return;
				}
				break;
			case "/author/coauthors":
				if (!req.body.authorId) {
					res
						.status(400)
						.send({
							message: "Error: Request body should have property authorId",
						})
						.end();
					return;
				}
				break;
			case "/author/compare":
				if (!Array.isArray(req.body.scholarList)) {
					return res.status(400).json({
						message: "Error: Scholars must be provided as an array.",
					});
				}
				break;
			default:
				break;
		}
		next();
	}
}

export default AuthorController;
