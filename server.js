import express, { json } from "express";
import cors from "cors";

const app = express();
import authRoutes from "./src/routes/authorRoutes.js";
import paperRoutes from "./src/routes/paperRoutes.js";

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
