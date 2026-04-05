const router = require("express").Router();
const axios  = require("axios");

const FLASK_URL = "http://localhost:5001";

router.post("/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Text is required" });
        }

        const response = await axios.post(`${FLASK_URL}/predict`, { text });

        res.status(200).json({
            sentiment:  response.data.sentiment,
            confidence: response.data.confidence,
            label:      response.data.label
        });

    } catch (err) {
        res.status(200).json({
            sentiment:  "neutral",
            confidence: 0,
            label:      -1
        });
    }
});

module.exports = router;