"use client";

import React, { useEffect, useState } from "react";
import { useFAQs } from "@/components/property/property-form/hooks/useFAQs";

export default function Step3FaqPanelCollapsibleCard() {
  const [faqOpen, setFaqOpen] = useState(false);
  const {
    faqs,
    newQuestion,
    newAnswer,
    suggestedFaqsList,
    setNewQuestion,
    setNewAnswer,
    handleAddFaq,
    handleRemoveFaq,
    handleToggleFaqDisplay,
    handleSelectSuggestedFaq,
    loadSuggestedFaqs,
  } = useFAQs();

  useEffect(() => {
    if (faqOpen) {
      void loadSuggestedFaqs();
    }
  }, [faqOpen, loadSuggestedFaqs]);

  return (
    <>
      <style jsx global>{`
        .step3-scroll-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 158, 142, 0.7) transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        .step3-scroll-thin::-webkit-scrollbar-thumb {
          background-color: rgba(79, 158, 142, 0.75);
          border-radius: 9999px;
        }
        .step3-scroll-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div
        className={[
          "bg-white/95 border border-white/60 py-1 mt-4",
          faqOpen ? "rounded-3xl" : "rounded-full",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setFaqOpen((v) => !v)}
          aria-expanded={faqOpen}
          className="w-full rounded-full px-5  text-right text-[14px] text-black transition-colors"
        >
          الأسئلة الشائعة الخاصة بالوحدة
        </button>

        {faqOpen && (
          <div className="mt-3 p-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
            <div className="text-right text-[12px] text-black/60">
              أضف أسئلة وأجوبة شائعة حول هذه الوحدة لمساعدة المشترين المحتملين
            </div>

            <div className="mt-4 space-y-4 p-4 border rounded-3xl bg-transparent">
              <h3 className="text-lg font-medium text-right text-black">
                إضافة سؤال جديد
              </h3>

              <div className="space-y-2">
                <label
                  htmlFor="onboardingFaqQuestion"
                  className="block text-right text-[14px] font-medium text-black"
                >
                  السؤال
                </label>
                <input
                  id="onboardingFaqQuestion"
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="مثال: هل مسموح بالحيوانات الأليفة؟"
                  className="w-full rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-right placeholder:text-black/40 text-[14px] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="onboardingFaqAnswer"
                  className="block text-right text-[14px] font-medium text-black"
                >
                  الإجابة
                </label>
                <input
                  id="onboardingFaqAnswer"
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="مثال: نعم، مسموح بالحيوانات الأليفة الصغيرة."
                  className="w-full rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-right placeholder:text-black/40 text-[14px] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="block w-full rounded-full bg-[#4f9e8e] px-4 py-1 text-center text-white transition-colors hover:bg-[#3a8075] lg:w-auto"
              >
                إضافة سؤال
              </button>

              {suggestedFaqsList?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-right text-[14px] font-bold text-black">
                    أسئلة مقترحة:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestedFaqsList.map((sq: any, index: number) => (
                      <button
                        key={sq?.id ?? `${index}-${sq?.question ?? "q"}`}
                        type="button"
                        onClick={() => handleSelectSuggestedFaq(sq)}
                        className="w-full rounded-full bg-white border border-gray-200 px-2 py-1 text-center text-black transition-colors hover:bg-gray-100 whitespace-normal break-words text-[12px]"
                      >
                        {sq?.question ?? ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {faqs?.length > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="text-right text-[14px] font-bold text-black">
                  الأسئلة المضافة ({faqs.length})
                </div>
                <div className="space-y-2">
                  {faqs.map((faq: any) => (
                    <div
                      key={faq.id}
                      className="rounded-3xl border border-gray-200 bg-white/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 text-right">
                          <div className="text-[14px] font-semibold text-black break-words">
                            {faq.question}
                          </div>
                          <div className="mt-1 text-[13px] text-black/70 break-words">
                            {faq.answer}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleFaqDisplay(faq.id)}
                            className={[
                              "rounded-full border px-3 py-1 text-[12px] transition-colors",
                              faq.displayOnPage
                                ? "bg-[#4f9e8e] text-white border-[#4f9e8e]"
                                : "bg-white text-black border-gray-300",
                            ].join(" ")}
                            title={
                              faq.displayOnPage
                                ? "إخفاء من صفحة الوحدة"
                                : "عرض في صفحة الوحدة"
                            }
                          >
                            {faq.displayOnPage ? "معروض" : "مخفي"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(faq.id)}
                            className="rounded-full border border-red-200 bg-white px-3 py-1 text-[12px] text-red-600 transition-colors hover:bg-red-50"
                            title="حذف السؤال"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center text-[12px] text-black/50">
                لم تتم إضافة أي أسئلة شائعة بعد.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}




























