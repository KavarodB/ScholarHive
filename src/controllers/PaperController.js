import semanticScholar from "../models/semanticScholarAPI.js";
import PaperLogicParser from "../logic/paperLogicParser.js";
import AbstractController from "./AbstractController.js";
import isEmptyObject from "../utils/isEmpty.js";

class PaperController extends AbstractController {
	async searchPapers(req, res) {
		try {
			const { query, filters } = req.body;
			const data = await semanticScholar.getPaperByQuery(query, filters);
			const parsed = PaperLogicParser.searchPapersParser(data);
			res.status(200);
			res.json(parsed);
			res.end();
		} catch (error) {
			res.status(500);
			res.json({ message: "API Error: Retrieving papers." });
			res.end();
		}
	}
	checkSigniture(req, res, next) {
		if (isEmptyObject(req.body)) {
			res.status(400);
			res.json({ message: "Error: Request body should not be empty." });
			res.end();
			return;
		}
		switch (req.originalUrl) {
			case "/paper/search":
				if (!req.body.query) {
					res.status(400);
					res.json({
						message: "Error: Request body should have property query",
					});
					res.end();
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
