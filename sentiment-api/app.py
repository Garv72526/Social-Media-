from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import string

# ── Setup ──────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ── Load model ─────────────────────────────────────────────
print("Loading model...")
model      = joblib.load("sentiment_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")
print("✅ Model loaded!")

# ── Clean text ─────────────────────────────────────────────
def clean_text(text):
    text = text.lower()
    text = re.sub(r"<.*?>", " ", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text).strip()
    return text

# ── Routes ─────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({ "status": "running" })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({ "error": "Missing text" }), 400

        cleaned    = clean_text(data["text"])
        vectorized = vectorizer.transform([cleaned])
        prediction  = model.predict(vectorized)[0]
        probability = model.predict_proba(vectorized)[0]
        confidence  = float(probability[prediction])

        return jsonify({
            "sentiment":  "positive" if prediction == 1 else "negative",
            "confidence": round(confidence, 4),
            "label":      int(prediction)
        })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

# ── Run ────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5001)