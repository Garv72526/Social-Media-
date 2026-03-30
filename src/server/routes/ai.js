require("dotenv").config();
const router = require("express").Router();
const Groq = require("groq-sdk");

router.post("/caption", async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // ← change in .env too
  const { desc } = req.body;

  if (!desc || desc.trim() === "") {
    return res.status(400).json({ caption: "No post text provided." });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free model
      messages: [{ role: "user", content: `Write a short catchy social media caption for: "${desc}". Under 20 words.` }],
      max_tokens: 60,
    });
    const caption = response.choices[0].message.content.trim();
    res.status(200).json({ caption });

  } catch (err) {
    console.log("Groq error:", err.message);
    res.status(500).json({ caption: `Error: ${err.message}` });
  }
});

module.exports = router;
