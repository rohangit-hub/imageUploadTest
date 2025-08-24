import { GoogleGenAI } from "@google/genai" 

export default async function GenerateText(req,res){
    const {question} = req.body //get the question from the req.body

    const ai = new GoogleGenAI({ apiKey: process.env.GENAIAPIKEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: question
        });

        return res.status(201).send({
            Answer: response.text
        })
    }
