import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

import cors from "cors";
import authRoutes from "./src/routes/authorRoutes.js";
import paperRoutes from "./src/routes/paperRoutes.js";
import { rateLimit } from "express-rate-limit";

// Rate limiting middleware (95 requests per second)
const limiter = rateLimit({
	windowMs: 1000, // 1 second
	max: 95,
});

// Apply rate limiting middleware to all routes
app.use(limiter);

// Middleware
app.use(json());
app.use(
	cors({
		origin: true, 
		credentials: true, 
		methods: "POST,GET,OPTIONS",
	})
);

// Routes
app.use("/author", authRoutes);
app.use("/paper", paperRoutes);

//Only for production.
if (process.argv[2] == "production") {
	app.use(express.static(path.join(__dirname, "public")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "public/index.html"));
	});
}

// Start the server
const port = 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
