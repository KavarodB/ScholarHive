import express, { json } from "express";
import cors from "cors";

const app = express();
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

// Start the server
const port = 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
