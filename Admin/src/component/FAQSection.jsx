import React, { useState } from "react";
import { ChevronDown, HelpCircle, CheckCircle } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Is GyanBrix useful for Class 10 Assamese Medium students?",
      answer:
        "Yes — GyanBrix is designed specially for SEBA Class 10 Assamese Medium students. It includes notes, solutions, PDFs and mock tests.",
    },
    {
      question: "Is GyanBrix free?",
      answer: "Yes — GyanBrix is 100% free for students across Assam.",
    },
    {
      question: "Can I use GyanBrix offline?",
      answer:
        "Yes! You can download PDFs and study materials to use offline without internet connection.",
    },
    {
      question: "Which subjects are covered in GyanBrix?",
      answer:
        "GyanBrix covers all SEBA Class 10 subjects including General Science, General Mathematics, Social Science, English, and Assamese.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">
              Got Questions?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about GyanBrix
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`mt-1 p-2 rounded-xl transition-all ${
                      openIndex === index
                        ? "bg-purple-600"
                        : "bg-purple-100 group-hover:bg-purple-200"
                    }`}
                  >
                    <CheckCircle
                      className={`w-5 h-5 transition-colors ${
                        openIndex === index ? "text-white" : "text-purple-600"
                      }`}
                    />
                  </div>
                  <span className="text-lg font-semibold text-gray-900 flex-1 pr-4">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-purple-600 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-48" : "max-h-0"
                }`}
              >
                <div className="px-8 pb-6 pl-20">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            Contact us in the GyanBrix app
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
