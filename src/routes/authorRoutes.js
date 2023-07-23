import { Router } from "express";
import AuthorController from "../controllers/authorController.js";
const authorController = new AuthorController();
const router = Router();

// Route: /author/search
router.post(
	"/search",
	authorController.checkSigniture,
	authorController.authorByName
);

// Route: /author/id
router.post(
	"/id",
	authorController.checkSigniture,
	authorController.authorById
);

//Route: /author/citations
router.post(
	"/citations",
	authorController.checkSigniture,
	authorController.authorPapers
);

//Route: /author/coauthors
router.post(
	"/coauthors",
	authorController.checkSigniture,
	authorController.authorCoAuthors
);

//Route: /author/compare
router.post(
	"/compare",
	authorController.checkSigniture,
	authorController.authorCompare
);

export default router;
