import express from "express";
const router = express.Router();

import multer from "multer";
import { storage } from "./controller/imageUpload.js";
const upload = multer({ storage });




// Import all the routes
import TestApi from "./controller/testApi.js";
import GenerateText from "./controller/generateText.js";
import uploadImage from "./controller/imageUpload.js";


// controller for the routes
router.get("/", TestApi);
router.post("/generateText", GenerateText);
router.post("/upload", upload.single("image"), uploadImage); // image is a parameter in the request body "image"



export default router;

