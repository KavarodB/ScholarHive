import semanticScholar from "../models/semanticScholarAPI.js";
import AuthorLogicParser from "../logic/authorLogicParser.js";
import AbstractController from "./AbstractController.js";
import isEmptyObject from "../utils/utils.js";
import LRUCacheHandler from "../utils/cacheHandler.js";
const cacheHandler = new LRUCacheHandler();
const cacheCitations = new LRUCacheHandler();

class AuthorController extends AbstractController {
	async authorByName(req, res) {
		const data = await semanticScholar
			.getAuthorByName(req.body.authorname)
			.then((data) => data.data)
			.catch(() => {
				res
					.status(500)
					.send({ message: "API Error: Retrieving the list of authors" });
			});
		if (!data) return;
		const parsed = AuthorLogicParser.authorNameParser(data);
		res.json(parsed);
		res.end();
	}

	async authorById(req, res) {
		const authorId = req.body.authorId;
		const found = cacheHandler.get(authorId);
		if (found) {
			res.json(found).end();
			return;
		}
		const data = await semanticScholar
			.getAuthorById(authorId)
			.then((data) => data.data)
			.catch((err) => {
				res.status(500).send({
					message: `API Error: Retrieving author with id ${authorId}`,
				});
			});
		if (!data) return;
		const parsed = AuthorLogicParser.authorIdParser(authorId, data);
		cacheHandler.set(authorId, parsed);
		res.json(parsed);
		res.end();
	}

	async authorPapers(req, res) {
		const { authorId } = req.body;
		const found_cit = cacheCitations.get(authorId);
		if (found_cit) {
			res.json(found_cit).end();
			return;
		}
		const data = await semanticScholar
			.getAuthorsPaper(authorId)
			.then((data) => data.data)
			.catch((error) => {
				console.log(error.config);
				res
					.status(500)
					.send({ message: "API Error: Retrieving the list of papers" });
			});
		if (!data) return;
		const found = cacheHandler.get(authorId);
		let coauthorIds = [];
		if (found) coauthorIds = found.paperData.coauthorIds;
		const parsed = AuthorLogicParser.authorPapersParser(
			authorId,
			coauthorIds,
			data
		);
		cacheCitations.set(authorId, parsed);
		res.json(parsed);
		res.end();
	}

	async authorCoAuthors(req, res) {
		const { authorId } = req.body;
		const found = cacheHandler.get(authorId);
		let coauthorIds = [];
		let fieldOfStudy = [];
		if (found) {
			coauthorIds = found.paperData.coauthorIds;
			fieldOfStudy = found.paperData.fieldsOfStudy;
		} else {
			res.status(500).send({
				message:
					"Error: Retrieving the list of coauthors for scholar " + authorId,
			});
			return;
		}
		const data = await semanticScholar
			.postMultipleAuthors(coauthorIds)
			.then((data) => data.data)
			.catch((error) => {
				res.status(500).send({
					message:
						"Error: Retrieving the list of coauthors for scholar " + authorId,
				});
			});
		if (!data) return;
		const parsed = AuthorLogicParser.authorCoAuthorParser(data, fieldOfStudy);
		res.json(parsed);
		res.end();
	}
	checkSigniture(req, res, next) {
		if (isEmptyObject(req.body)) {
			res
				.status(500)
				.send({ message: "Error: Request body should not be empty." })
				.end();
			return;
		}
		switch (req.originalUrl) {
			case "/author/search":
				if (!req.body.authorname) {
					res
						.status(500)
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
						.status(500)
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
						.status(500)
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
						.status(500)
						.send({
							message: "Error: Request body should have property authorId",
						})
						.end();
					return;
				}
				break;
			default:
				break;
		}
		next();
	}
}

export default AuthorController;
