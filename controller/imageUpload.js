import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.COUDINARY_DB,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'some-folder-name',
        format: async (req, file) => ['jpg', 'png', 'jpeg'], // supports promises as well
        public_id: (req, file) => file.originalname + "-" + Date.now(),
      },
});


export default async function uploadImage(req, res) {
    try {
        const result = req.file
        res.status(200).json({ message: "Image uploaded successfully", result }); 

    } catch (error) {
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}