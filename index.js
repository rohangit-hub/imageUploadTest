import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db.js";
import routerApi from "./router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use("/api/v1", routerApi);

// Global error handler (handles Multer and general errors)
app.use((err, req, res, next) => {
	if (!err) return next();
	// Multer errors
	if (err.name === "MulterError") {
		const codeToMessage = {
			LIMIT_FILE_SIZE: "File too large",
		};
		return res.status(400).json({ message: codeToMessage[err.code] || "Upload error", error: err.message });
	}
	if (err.message && err.message.includes("Only image uploads are allowed")) {
		return res.status(400).json({ message: "Only image uploads are allowed" });
	}
	return res.status(500).json({ message: "Internal server error", error: err.message });
});

// first Connect to MongoDB and then start the server
connectDB()
.then(()=>{
	app.listen(process.env.PORT || 3040, () => {
		console.log(`==> Server is running on port ${process.env.PORT || 3040}`);
	});
})
.catch((error)=>{
	console.log(error);
});






