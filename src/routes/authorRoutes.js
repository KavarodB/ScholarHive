import { Router } from "express";
import AuthorController from "../controllers/authorController.js";
const authorController = new AuthorController();
const router = Router();

// Route: /author/id
router.get("/id",authorController.checkSigniture, authorController.authorById);

// Route: /author/search
router.get("/search", authorController.checkSigniture, authorController.authorByName);

//Route: /author/papers
router.get("/papers", authorController.checkSigniture, authorController.authorPapers);

export default router;
