# EcoBuddy

EcoBuddy is a blockchain-powered AI chatbot built on the **Internet Computer (ICP)** using **Motoko**. This project is designed to promote environmental awareness and encourage users to take eco-friendly actions. By leveraging **smart contracts** and **decentralized computing**, EcoBuddy provides a transparent and efficient platform for sustainable initiatives.

## 🌿 Features
- **AI-Powered Chatbot** – Provides solutions to environmental queries and assesses user engagement.
- **EXP & Leveling System** – Users earn EXP based on their interactions and unlock new chatbot skins.
- **Daily Quests & Achievements** – Users complete eco-friendly challenges to earn rewards.
- **Dynamic Daily Quizzes** – AI-generated environmental quizzes that refresh every day.
- **Blockchain-Based Donations** – Users donate **ICP tokens**, which are used to plant real trees.
- **Virtual Garden** – Visual representation of donated trees via **2D animations**.
- **News Feed** – Curated environmental news updates.

## 🚀 Technology Stack
- **Frontend:** React, Tailwind CSS, GSAP, Draggable React
- **Backend:** Motoko (Deployed on ICP)
- **AI Integration:** Gemini AI API, OpenAI GPT API
- **Blockchain:** ICP (Internet Computer), Smart Contracts

## 🔧 Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **Dfinity SDK (dfx)** – To deploy on ICP
- **Git**

## 🛠 Installation
Clone the repository and install dependencies:
```sh
# Clone the repo
git clone https://github.com/your-username/ecobuddy.git
cd ecobuddy

# Install dependencies
npm install
```

## 🌎 Environment Setup
To integrate **Gemini AI** and **GPT**, you need API keys:

1. **Obtain Gemini API Key**
   - Sign up at [Google AI](https://ai.google.dev/) and generate an API key.
   - Add the key to your `.env` file:
     ```sh
     GEMINI_API_KEY=your_api_key_here
     ```

2. **Obtain OpenAI GPT API Key**
   - Sign up at [OpenAI](https://openai.com/) and generate an API key.
   - Add the key to your `.env` file:
     ```sh
     OPENAI_API_KEY=your_api_key_here
     ```

## 💻 Local Development
To start the local development server:
```sh
# Start ICP backend
dfx start --background

# Deploy canisters
dfx deploy

# Start frontend
dfx canister call backend init
npm run dev
```
Your application should now be running at `http://localhost:3000/`.

## 🔮 Conclusion & Future Plans
EcoBuddy aims to **bridge blockchain technology and environmental consciousness** through an engaging AI-driven chatbot. Moving forward, we plan to:
- **Introduce NFT-based Achievements** for users who contribute significantly.
- **Expand Donation Models** to support multiple cryptocurrencies.
- **Enhance AI Capabilities** with real-time environmental data analysis.
- **Launch a Mobile Version** for greater accessibility.

🌍 *Join us in making a greener future with EcoBuddy!* 🚀
