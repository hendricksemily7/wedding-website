// src/app/qa/page.tsx
"use client";

import { useState } from "react";
import { Playfair_Display } from "next/font/google";
import { FaChevronDown } from "react-icons/fa";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

const faqs = [
  {
    question: "Can I bring a plus one?",
    answer:
      "We have a limited guest list, so we are only able to accommodate the guests formally invited on your invitation.",
  },
  {
    question: "Is this wedding kid-friendly?",
    answer:
      "While we love your little ones, we have chosen to make our wedding an adults-only celebration. We hope this gives you a chance to enjoy a night off!",
  },
  {
    question: "Will there be parking at the venue?",
    answer:
      "Yes! There is ample free parking available at the venue. Simply follow the signs when you arrive.",
  },
  {
    question: "Is there a shuttle service?",
    answer:
      "Yes, we will be providing shuttle service between the hotel block and the venue. Please indicate on your RSVP if you plan to use the shuttle.",
  },
  {
    question: "What is the dress code?",
    answer:
      "The dress code is semi-formal/cocktail attire. The ceremony will be outdoors, so please plan accordingly with comfortable footwear for grass.",
  },
  {
    question: "Is there an open bar?",
    answer:
      "Yes, there will be an open bar available during the cocktail hour and reception for all guests to enjoy.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full py-5 flex justify-between items-center text-left hover:text-gray-600 transition-colors"
      >
        <span className="text-lg font-medium">{question}</span>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <h1
        className={`${playfair.className} text-2xl md:text-3xl font-bold mb-8 text-center`}
      >
        Questions & Answers
      </h1>

      <div className="bg-stone-100 rounded-2xl shadow-sm p-6 md:p-8">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}
