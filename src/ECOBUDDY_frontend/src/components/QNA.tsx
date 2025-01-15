import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is EcoBuddy?",
      answer:
        "EcoBuddy is your personal assistant for sustainable living. It helps you sort waste, track your eco-friendly actions, and provides tips to make greener choices every day.",
    },
    {
      question: "How does the waste sorting feature work?",
      answer:
        "EcoBuddy guides you step-by-step to categorize your waste into recyclables, organics, and non-recyclables. It also provides nearby drop-off locations for proper disposal.",
    },
    {
      question: "What benefits do I get as a Premium user?",
      answer:
        "Premium users enjoy features like detailed impact tracking, advanced waste sorting suggestions, exclusive bot customization, and priority access to eco-friendly resources.",
    },
    {
      question: "Is EcoBuddy free to use?",
      answer:
        "Yes, EcoBuddy offers a Free Plan that provides essential features like eco-tips, waste sorting guides, and basic progress tracking. For advanced features, you can upgrade to the Premium Plan.",
    },
    {
      question: "Can I earn rewards with EcoBuddy?",
      answer:
        "Yes! By completing green activities and selling recyclable materials through the platform, you can earn tokens that can be used for various rewards or transactions.",
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
