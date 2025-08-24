import express from "express";
const router = express.Router();

import multer from "multer";
import { storage } from "./controller/imageUpload.js";

// Only accept images; set 10MB default limit or use env override
const imageFileFilter = (req, file, cb) => {
	if (!file || !file.mimetype) return cb(new Error("Invalid file"));
	if (file.mimetype.startsWith("image/")) return cb(null, true);
	return cb(new Error("Only image uploads are allowed"));
};

const upload = multer({
	storage,
	fileFilter: imageFileFilter,
	limits: { fileSize: Number(process.env.MAX_IMAGE_SIZE_BYTES || 10 * 1024 * 1024) },
});

// Import all the routes
import TestApi from "./controller/testApi.js";
import GenerateText from "./controller/generateText.js";
import uploadImage from "./controller/imageUpload.js";

// controller for the routes
router.get("/", TestApi);
router.post("/generateText", GenerateText);
router.post("/upload", upload.single("image"), uploadImage); // image is a parameter in the request body "image"

export default router;

