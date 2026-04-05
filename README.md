# SocialSphere — AI-Powered Social Networking App

A full-stack social media platform with an integrated NLP sentiment analysis model that automatically classifies posts as positive or negative in real time.

## Live Demo
[Add your deployed link here]

## Features
- Real-time private messaging using Socket.io
- Follow/unfollow users with instant notifications
- Image post creation with AI sentiment analysis
- Live online friends sidebar
- User authentication with JWT

## AI/ML Component
- Trained a Logistic Regression model on 50,000 IMDB reviews
- TF-IDF vectorization with 10,000-word vocabulary and bigram support
- 88%+ accuracy evaluated using precision, recall and F1 score
- Deployed as a Python Flask REST API connected to Node.js backend

## Tech Stack
**Frontend:** React.js, Context API, Socket.io-client  
**Backend:** Node.js, Express.js, Socket.io  
**ML API:** Python, Flask, Scikit-learn, Joblib  
**Database:** MongoDB  

## Setup
\```
# Frontend
cd client && npm install && npm run dev

# Backend
cd server && npm install && node index.js

# ML API
cd sentiment-api && pip install -r requirements.txt && python app.py
\```

## Screenshots
[Add a screenshot of your app here]
