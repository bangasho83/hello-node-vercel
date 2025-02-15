require("dotenv").config();
console.log("Loaded OpenAI Key:", process.env.OPENAI_API_KEY ? "Yes" : "No");
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON

// 🟢 This is the missing /chat route!
app.post("/chat", async (req, res) => {
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

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Default route
app.get("/", (req, res) => {
    res.send("Hello, this is your ChatGPT API app!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
