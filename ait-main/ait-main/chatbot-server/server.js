// server.js
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ask', async (req, res) => {
    const userInput = req.body.input;

    if (!userInput) {
        return res.status(400).json({ error: 'Missing input' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer sk-or-v1-...",  // ✅ INCLUDE "Bearer "
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "user",
                        content: userInput
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenRouter Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        res.json(data);

    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
});
