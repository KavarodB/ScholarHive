import { Router } from "express";
import AuthorController from "../controllers/authorController.js";
const authorController = new AuthorController();
const router = Router();

// Route: /author/id
router.post("/id",authorController.checkSigniture, authorController.authorById);

// Route: /author/search
router.post("/search", authorController.checkSigniture, authorController.authorByName);

//Route: /author/papers
router.post("/papers", authorController.checkSigniture, authorController.authorPapers);

export default router;
