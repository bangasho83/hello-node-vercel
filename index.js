require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/chat", async (req, res) => {
    console.log("Received request:", req.body);

    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("API Response:", response.data);
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Hello, this is your ChatGPT API app!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
