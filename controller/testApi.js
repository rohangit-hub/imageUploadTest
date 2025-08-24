import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function TestApi(req, res){
    try {
        const imagePath = path.join(__dirname, "../assets/testImage.jpg");
        res.status(200).sendFile(imagePath);
    } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).json({ error: "Failed to serve image" });
    }
}