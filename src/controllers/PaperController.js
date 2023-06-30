import semanticScholar from "../models/semanticScholarAPI.js";
import PaperLogicParser from "../logic/paperLogicParser.js";
import AbstractController from "./AbstractController.js";

class PaperController extends AbstractController {
	async searchPapers(req, res) {
		const data = await semanticScholar
			.getPaperByQuery(req.body.query, req.body.filters)
			.catch(() => {
				res.status(500).send("Error retrieving papers.");
			});
		if (!data) return;
		const parsed = PaperLogicParser.searchPapersParser(data.data);

		res.json(parsed);
		res.end();
	}
	async checkSigniture(req, res, next) {
		if (isEmptyObject(req.body)) {
			res.status(500).send("Error passed data is invalid.").end();
			return;
		} else {
			next();
		}
	}
}

export default PaperController;
