import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/api/recipe", async(req, res) => {
    try {
        const { ingredients } = req.body;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{
                    role: "system",
                    content: "You are a chef. Create tasty recipes based on ingredients.",
                },
                {
                    role: "user",
                    content: `Generate a recipe using: ${ingredients}`,
                },
            ],
        });

        res.json({ recipe: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate recipe" });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});