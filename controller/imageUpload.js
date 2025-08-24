import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// this is the code by which we can upload the image to the cloudinary
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

        // send the image url to the client
        return res.status(200).json({
            message: "Image uploaded successfully..!",
            file: req.file,
        });
    } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}

/*

{
    "message": "Image uploaded successfully..!",
    "file": {
        "fieldname": "image",
        "originalname": "parrotProfile.jpg",
        "encoding": "7bit",
        "mimetype": "image/jpeg",
        "path": "https://res.cloudinary.com/dixiwmfbg/image/upload/v1756053572/Test-Images/parrotProfile.jpg-1756053570647.jpg",
        "size": 8046597,
        "filename": "Test-Images/parrotProfile.jpg-1756053570647"
    }
}

*/