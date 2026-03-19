"use client";

import React, { useEffect, useState } from "react";

export default function Step3FaqPanelCollapsibleCard() {
  const [faqOpen, setFaqOpen] = useState(false);
  const [selectedSuggestedQuestions, setSelectedSuggestedQuestions] = useState<string[]>([]);
  const [displayedSuggestedQuestions, setDisplayedSuggestedQuestions] = useState<string[]>([]);

  const suggestedQuestions = [
    "متى يمكنني معاينة هذا العقار؟",
    "هل العقار مفروش؟",
    "ما هي سياسة الحيوانات الأليفة؟",
    "هل تتوفر مواقف للسيارات؟",
    "هل يوجد بواب أو حارس أمن؟",
  ];

  function shuffleByLengthRandom(items: string[]) {
    const shuffle = (arr: string[]) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const cat = (s: string) => {
      const len = s.replace(/\s+/g, "").length;
      if (len <= 16) return "short";
      if (len <= 26) return "mid";
      return "long";
    };

    const groups: Record<"short" | "mid" | "long", string[]> = {
      short: [],
      mid: [],
      long: [],
    };

    for (const item of items) {
      groups[cat(item)].push(item);
    }

    const long = shuffle(groups.long);
    const mid = shuffle(groups.mid);
    const short = shuffle(groups.short);

    const result: string[] = [];
    const maxLen = Math.max(long.length, mid.length, short.length);
    for (let i = 0; i < maxLen; i++) {
      if (long[i]) result.push(long[i]);
      if (mid[i]) result.push(mid[i]);
      if (short[i]) result.push(short[i]);
    }

    return result;
  }

  useEffect(() => {
    if (!faqOpen) {
      setSelectedSuggestedQuestions([]);
      return;
    }
    setDisplayedSuggestedQuestions(shuffleByLengthRandom(suggestedQuestions));
  }, [faqOpen]);

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
          className="w-full rounded-full px-5 py-2 text-right text-[14px] text-black transition-colors"
        >
          الأسئلة الشائعة الخاصة بالوحدة
        </button>

        {faqOpen && (
          <div className="mt-3 p-5 space-y-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
            <div className="text-right text-[12px] text-black/60">
              أضف أسئلة وأجوبة شائعة حول هذه الوحدة لمساعدة المشترين المحتملين
            </div>

            <div className="space-y-4 p-4 border rounded-3xl bg-transparent">
              <h3 className="text-lg font-medium text-right text-black">إضافة سؤال جديد</h3>

              <div className="space-y-2">
                <label htmlFor="newQuestion" className="block text-right text-[14px] font-medium text-black ">
                  السؤال
                </label>
                <input
                  id="newQuestion"
                  type="text"
                  placeholder="مثال: هل مسموح بالحيوانات الأليفة؟"
                  className="w-full rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-right placeholder:text-black/40 text-[14px] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newAnswer" className="block text-right text-[14px] font-medium text-black">
                  الاجابة
                </label>
                  <input
                  id="newAnswer"
                  type="text"
                  placeholder="مثال: هل مسموح بالحيوانات الأليفة؟"
                  className="w-full rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-right placeholder:text-black/40 text-[14px] focus:outline-none"
                />
              </div>

              <button
                type="button"
                className=" block w-full rounded-full bg-[#4f9e8e] px-4 py-1 text-center text-white transition-colors hover:bg-[#3a8075] lg:w-auto"
              >
                إضافة سؤال
              </button>
              
              <div className="text-right text-[14px] font-bold text-black">
                اسئلة مقترحة:
              </div>
              
              
              
              
              <div className="grid grid-cols-3 gap-2">
                {(displayedSuggestedQuestions.length > 0 ? displayedSuggestedQuestions : suggestedQuestions).map((q, index) => (
                  <button
                    key={`${index}-${q}`}
                    type="button"
                    onClick={() =>
                      setSelectedSuggestedQuestions((prev) =>
                        prev.includes(q) ? prev.filter((item) => item !== q) : [...prev, q]
                      )
                    }
                    style={
                      selectedSuggestedQuestions.includes(q)
                        ? { backgroundColor: "#3a8075", borderColor: "#3a8075" }
                        : undefined
                    }
                    className={
                      selectedSuggestedQuestions.includes(q)
                        ? "w-full rounded-full border px-1 py-1 text-center text-white transition-colors hover:opacity-90 whitespace-normal break-words text-[12px]"
                        : "w-full rounded-full bg-white border px-1 py-1 text-center text-black transition-colors hover:bg-gray-300 whitespace-normal break-words text-[12px]"
                    }
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}




























