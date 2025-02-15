require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static("public"));

// Serve index.html for the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ChatGPT API endpoint
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo-1106",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 50
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
