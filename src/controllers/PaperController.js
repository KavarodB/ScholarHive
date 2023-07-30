import semanticScholar from "../models/semanticScholarAPI.js";
import PaperLogicParser from "../logic/paperLogicParser.js";
import AbstractController from "./AbstractController.js";
import isEmptyObject from "../utils/isEmpty.js";

class PaperController extends AbstractController {
	async searchPapers(req, res) {
		const { query, filters } = req.body;
		try {
			const data = await semanticScholar.getPaperByQuery(query, filters);
			const parsed = PaperLogicParser.searchPapersParser(data);
			res.json(parsed);
			res.end();
		} catch (error) {
			res.status(500).send({ message: "API Error: Retrieving papers." });
		}
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
			case " /paper/search":
				if (!req.body.query) {
					res
						.status(500)
						.send({
							message: "Error: Request body should have property query",
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

export default PaperController;
