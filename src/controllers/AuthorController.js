import semanticScholar from "../models/semanticScholarAPI.js";
import AuthorLogicParser from "../logic/authorLogicParser.js";
import AbstractController from "./AbstractController.js";

class AuthorController extends AbstractController {
	async authorById(req, res) {
		const authorId = req.body.authorId;

		const data = await semanticScholar.getAuthorById(authorId).catch((err) => {
			res.status(500).send(`Error retrieving author with id ${authorId}`);
		});
		if (!data) return;
		const parsed = AuthorLogicParser.authorIdParser(authorId, data.data);

		res.json(parsed);
		res.end();
	}

	async authorByName(req, res) {
		const data = await semanticScholar
			.getAuthorByName(req.body.firstname, req.body.lastname)
			.catch(() => {
				res.status(500).send("Error retrieving the list of authors");
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
				res.status(500).send("Error retrieving the list of papers");
			});
		if (!data) return;
		const parsed = AuthorLogicParser.authorPapersParser(req.body.authorId,data.data);
		res.json(parsed);
		res.end();
	}

	 async checkSigniture(req, res, next) {
		if (isEmptyObject(req.body)) {
			res.status(500).send("Error passed data is invalid.").end();
			return;
		}else{
            next();
        }
	}
}

export default AuthorController;
