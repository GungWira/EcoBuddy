# EcoBuddy

EcoBuddy is a blockchain-powered AI chatbot built on the **Internet Computer (ICP)** using **Motoko**. This project is designed to promote environmental awareness and encourage users to take eco-friendly actions. By leveraging **smart contracts** and **decentralized computing**, EcoBuddy provides a transparent and efficient platform for sustainable initiatives.

<p align="center">
  <img src="https://i.imghippo.com/files/ucP2128Xx.png" width="100%">
</p>

Video Demo:  [https://youtube.com]
Documents: [https://drive.google.com/drive/folders/1FJM-WmmKf0G8A7nIps7uVL7myaYXoO6C?usp=sharing]
---

## 👥 Team Members
EcoBuddy is developed by a dedicated team of three members:
- **Ida Bagus Dharma Abimantra** – Leader, Backend Developer
- **Anak Agung Gede Putu Wiradarma** – Full-stack Developer
- **I Made Sutha Raditya** – UI/UX Designer

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
- **Node.js** (v16+ recommended) [Get It From](https://nodejs.org/)
- **Dfinity SDK (dfx)** – To deploy on ICP [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/getting-started/install)
- **Git** [Download](https://git-scm.com/downloads)

## 🛠 Installation
Clone the repository and install dependencies:
```sh
# Clone the repo
git clone https://github.com/GungWira/EcoBuddy.git
cd ecobuddy

# Install dependencies
npm install
mops install
```

## 🌎 Environment Setup
To integrate **Gemini AI** and **GPT**, you need API keys:

1. **Obtain Gemini API Key**
   - Sign up at [Google AI](https://ai.google.dev/) and generate an API key.
   - Add the key to your `/src/ECOBUDDY_backend/constants/GlobalConstants.mo` file:
     ```sh
     API_KEY=your_api_key_here
     ```
**OR**
2. **Obtain OpenAI GPT API Key**
   - Sign up at [OpenAI](https://openai.com/) and generate an API key.
   - Add the key to your `/src/ECOBUDDY_backend/constants/GlobalConstants.mo` file:
     ```sh
     GPT_API_KEY=your_api_key_here
     ```

## 💻 Local Development
To start the local development server:
1. Deploy the ICP Ledger:
   ```bash
   npm run deploy-ledger
   ```

2. Deploy project canisters:
   ```bash
   dfx deploy
   ```
   
Your application should now be running at `http://[your CANISTER_ID_ECOBUDDY_FRONTEND].localhost:8080`.

## 🔮 Conclusion & Future Plans
EcoBuddy aims to **bridge blockchain technology and environmental consciousness** through an engaging AI-driven chatbot. Moving forward, we plan to:
- **Eco Community** A digital platform that connects environmental enthusiasts to get to know each other, communicate, and build better relationships.
- **Eco Trash** A digital platform that helps users monetize every waste they sort and deliver to specific waste collectors, with payments made using ICP tokens.
- **3D Models** The use of 3D models in the Chatbot and Eco Tree to enhance user interaction.
- **Premium Features** Adding premium features as benefits for users subscribed to Ecobuddy.

🌍 *Join us in making a greener future with EcoBuddy!* 🚀
