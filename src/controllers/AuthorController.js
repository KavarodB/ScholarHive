import semanticScholar from "../models/semanticScholarAPI.js";
import AuthorLogicParser from "../logic/authorLogicParser.js";
import AbstractController from "./AbstractController.js";
import isEmptyObject from "../utils/utils.js";

class AuthorController extends AbstractController {
	async authorById(req, res) {
		const authorId = req.body.authorId;

		const data = await semanticScholar.getAuthorById(authorId).catch((err) => {
			res
				.status(500)
				.send({ message: `API Error: Retrieving author with id ${authorId}` });
		});
		if (!data) return;
		const parsed = AuthorLogicParser.authorIdParser(authorId, data.data);

		res.json(parsed);
		res.end();
	}

	async authorByName(req, res) {
		const data = await semanticScholar
			.getAuthorByName(req.body.authorname)
			.catch(() => {
				res
					.status(500)
					.send({ message: "API Error: Retrieving the list of authors" });
			});
		if (!data) return;
		const parsed = AuthorLogicParser.authorNameParser(data.data);
		res.json(parsed);
		res.end();
	}

	async authorPapers(req, res) {
		const data = await semanticScholar
			.getAuthorsPaper(req.body.authorId)
			.catch((error) => {
				console.log(error.config);
				res.status(500).send({message:"API Error: Retrieving the list of papers"});
			});
		if (!data) return;
		const parsed = AuthorLogicParser.authorPapersParser(
			req.body.authorId,
			data.data
		);
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
			case "/author/papers":
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
