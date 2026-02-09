"use client";

import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Property } from "../types/types";

interface PropertyFAQsProps {
  faqs: Property["faqs"];
  expandedFaqs: Set<number>;
  onToggleFaq: (faqId: number) => void;
}

export function PropertyFAQs({
  faqs,
  expandedFaqs,
  onToggleFaq,
}: PropertyFAQsProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const displayFaqs = faqs.filter((faq) => faq.displayOnPage);

  if (displayFaqs.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-18">
      <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
        <h3 className="text-gray-600 font-bold text-xl leading-6 lg:text-2xl lg:leading-7">
          الأسئلة الشائعة
        </h3>
        <div className="w-full space-y-4">
          {displayFaqs.map((faq) => {
            const isExpanded = expandedFaqs.has(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => onToggleFaq(faq.id)}
                  className="w-full p-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-semibold text-base leading-6">
                      {faq.question}
                    </h4>
                  </div>
                  <div className="mr-3 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm leading-6">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
