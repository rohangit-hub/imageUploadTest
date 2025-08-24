import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Validate required environment variables early with fallbacks for legacy names
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.COUDINARY_DB || process.env.CLOUDINARY_CLOUD;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    // Throwing here prevents misconfigured servers from starting silently
    throw new Error(
        "Missing Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME (or COUDINARY_DB), CLOUDINARY_API_KEY (or CLOUDINARY_API), CLOUDINARY_API_SECRET (or CLOUDINARY_SECRET)."
    );
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const [type, subtype] = (file?.mimetype || "").split("/");
        const extension = subtype || "jpg";
        return {
            folder: process.env.CLOUDINARY_FOLDER || "uploads",
            format: extension,
            public_id: `${file.originalname?.replace(/\.[^/.]+$/, "") || "image"}-${Date.now()}`,
            resource_type: type === "image" ? "image" : "auto",
        };
    },
});

export default async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided. Use field name 'image'" });
        }

        // multer-storage-cloudinary populates req.file with Cloudinary details
        const { path: url, filename, size, mimetype } = req.file;

        return res.status(200).json({
            message: "Image uploaded successfully",
            file: {
                url,
                public_id: filename,
                size,
                mimetype,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}