import { Router } from "express";
const router = Router();
import PaperController from "../controllers/paperController.js";
const paperController = new PaperController();

// Route: /paper/search
router.get(
	"/search",
	paperController.checkSigniture,
	paperController.searchPapers
);

export default router;
