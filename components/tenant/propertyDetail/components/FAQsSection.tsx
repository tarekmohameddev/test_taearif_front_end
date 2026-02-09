import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import type { Property } from "../types/types";

interface FAQsSectionProps {
  property: Property;
  expandedFaqs: Set<number>;
  toggleFaq: (faqId: number) => void;
  textColor: string;
  primaryColor: string;
}

export const FAQsSection = ({
  property,
  expandedFaqs,
  toggleFaq,
  textColor,
  primaryColor,
}: FAQsSectionProps) => {
  if (!property.faqs || property.faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-transparent" data-purpose="faqs-section">
      <h2 className="text-3xl font-bold mb-8 text-right" style={{ color: textColor }}>
        الأسئلة الشائعة
      </h2>
      <div className="w-full space-y-4">
        {property.faqs
          .filter((faq) => faq.displayOnPage)
          .map((faq) => {
            const isExpanded = expandedFaqs.has(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-base leading-6 text-right"
                      style={{ color: textColor }}
                    >
                      {faq.question}
                    </h4>
                  </div>
                  <div className="mr-3 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUpIcon
                        className="w-5 h-5"
                        style={{ color: primaryColor }}
                      />
                    ) : (
                      <ChevronDownIcon
                        className="w-5 h-5"
                        style={{ color: primaryColor }}
                      />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <p
                      className="text-sm leading-6 text-right"
                      style={{ color: textColor }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};
