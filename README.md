# AI Talk Helper

AI Talk Helper is a web-based application designed to help people communicate better in difficult or emotional conversations. It analyzes message tone and emotions, and provides smarter, kinder message suggestions using Deep Learning (NLP) and GPT.

## Features

- Enter a message and select relationship context (boss, friend, partner, etc.)
- Empathy score and emotional analysis (Hugging Face RoBERTa)
- 3+ GPT-generated message rewrites (softer, clearer, more confident)
- Conversation templates for common scenarios
- Voice input (Web Speech API)
- Multilingual tone analysis
- Google login and message history (Firebase Auth + Firestore)

## Tech Stack

- React (Vite)
- Firebase (Auth, Firestore)
- Material-UI
- Hugging Face Transformers
- OpenAI GPT-4 API

## Getting Started

1. Clone the repo and install dependencies:
   ```sh
   npm install
   ```
2. Set up Firebase and add your config to the project.
3. Run the development server:
   ```sh
   npm run dev
   ```

## Project Structure

- `src/components/` — Main UI components
- `src/firebase.js` — Firebase config and setup
- `src/App.jsx` — Main app logic

## License

MIT
