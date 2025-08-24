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






