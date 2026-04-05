// SentimentBadge.jsx — simplified, no PostSentimentChecker
import React, { useState, useEffect } from "react";
import axios from "axios";

function SentimentBadge({ text }) {
    const [sentiment,  setSentiment]  = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [loading,    setLoading]    = useState(false);

    useEffect(() => {
        if (!text || text.trim() === "") return;
        analyzeSentiment();
    }, [text]);

    const analyzeSentiment = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/api/sentiment/analyze", { text });
            setSentiment(res.data.sentiment);
            setConfidence(res.data.confidence);
        } catch (err) {
            console.log("Sentiment error:", err.message);
        }
        setLoading(false);
    };

    if (loading) return <span style={badge("gray")}>analyzing...</span>;
    if (!sentiment || sentiment === "neutral") return null;

    return (
        <span style={badge(sentiment)}>
            {sentiment === "positive" ? "😊" : "😞"} {sentiment}
            {confidence && (
                <span style={{ opacity: 0.7, fontSize: 10 }}>
                    {" "}({Math.round(confidence * 100)}%)
                </span>
            )}
        </span>
    );
}

// styles
const badge = (sentiment) => ({
    display:         "inline-block",
    fontSize:        11,
    fontWeight:      500,
    padding:         "2px 8px",
    borderRadius:    99,
    marginTop:       6,
    backgroundColor: sentiment === "positive" ? "#E1F5EE"
                   : sentiment === "negative" ? "#FAECE7"
                   : "#F1EFE8",
    color:           sentiment === "positive" ? "#085041"
                   : sentiment === "negative" ? "#4A1B0C"
                   : "#444441",
});

export default SentimentBadge;