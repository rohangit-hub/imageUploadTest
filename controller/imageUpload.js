import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'Test-Images',
        allowed_formats: ['jpeg', 'png', 'jpg'],
        resource_type: 'image',
        public_id: file.originalname + "-" + Date.now(),
      };
    },
  });

export default async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // Using CloudinaryStorage, the file is already uploaded to Cloudinary.
        // Multer provides the uploaded file metadata on req.file (including a secure URL at req.file.path)
        const { path: url, filename, size, mimetype } = req.file;

        return res.status(200).json({
            message: "Image uploaded successfully..!",
            url,
            public_id: filename,
            size,
            mimetype,
            file: req.file,
        });
    } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}