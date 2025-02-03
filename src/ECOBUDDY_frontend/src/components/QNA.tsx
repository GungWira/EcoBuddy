import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is EcoBuddy, and how does it work?",
      answer:
        "EcoBuddy is a blockchain-powered AI chatbot built on the Internet Computer (ICP) using Motoko. It helps users engage in eco-friendly activities, track their contributions, and earn EXP based on their environmental impact. With smart contract integration, users can securely donate ICP tokens to support tree-planting initiatives, ensuring transparency and real-world impact.",
    },
    {
      question: "How does the EXP system work in EcoBuddy?",
      answer:
        "Every time you interact with EcoBuddy, your input is evaluated based on its environmental impact. You earn EXP based on the importance of your actions, which helps level up your chatbot and unlock new skins. Completing daily quests and quizzes also grants additional EXP.",
    },
    {
      question: "How does the donation feature work?",
      answer:
        "Users can donate ICP tokens, which are securely processed through smart contracts on the Internet Computer blockchain. Every 0.5 ICP donated translates to a tree being planted, which is reflected in your virtual Garden page as an animated tree representing real-world contributions.",
    },
    {
      question: "How does EcoBuddy ensure transparency in donations?",
      answer:
        "EcoBuddy utilizes blockchain technology on the Internet Computer (ICP) to ensure full transparency and security in donations. All transactions are recorded on-chain, and users can track their contributions through a publicly verifiable ledger.",
    },
    {
      question: "What technologies power EcoBuddy?",
      answer:
        "EcoBuddy is built on the Internet Computer (ICP) using Motoko, React, Tailwind, GSAP, and Draggable React. AI-powered features are supported by Gemini AI API, ensuring an intelligent and interactive user experience.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto md:p-6">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-600 py-3 md:py-4">
          {/* Question */}
          <div
            onClick={() => toggleFAQ(index)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h3 className="text-base sm:text-base md:text-lg font-poppins font-medium text-white">
              {faq.question}
            </h3>
            <span
              className={`text-base sm:text-lg md:text-xl text-white transform transition-transform duration-300 ${
                expandedIndex === index ? "rotate-45" : "rotate-0"
              }`}
            >
              +
            </span>
          </div>

          {/* Answer */}
          <div
            className={`mt-2 overflow-hidden transition-max-height duration-500 ${
              expandedIndex === index ? "max-h-[300px]" : "max-h-0"
            }`}
          >
            <p className="text-whiteSoft sm:text-white sm:opacity-60 font-poppins text-sm sm:text-sm md:text-base">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
