import { useState } from "react";
import toast from "react-hot-toast";
import type { FAQ } from "../types/propertyForm.types";
import { fetchSuggestedFaqs } from "../services/dataService";

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [suggestedFaqsList, setSuggestedFaqsList] = useState<any[]>([]);

  const handleAddFaq = () => {
    if (newQuestion.trim() === "" || newAnswer.trim() === "") {
      toast.error("يرجى إدخال السؤال والإجابة");
      return;
    }

    const newFaq: FAQ = {
      id: Date.now(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      displayOnPage: true,
    };

    setFaqs([...faqs, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    toast.success("تم إضافة السؤال بنجاح");
  };

  const handleSelectSuggestedFaq = (suggestedFaq: any) => {
    setNewQuestion(suggestedFaq.question);
  };

  const handleRemoveFaq = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
    toast.success("تم حذف السؤال");
  };

  const handleToggleFaqDisplay = (id: number) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, displayOnPage: !faq.displayOnPage } : faq,
      ),
    );
  };

  const loadSuggestedFaqs = async (): Promise<any[]> => {
    try {
      const suggested = await fetchSuggestedFaqs();
      setSuggestedFaqsList(suggested);
      return suggested;
    } catch (error) {
      console.error("Error loading suggested FAQs:", error);
      return [];
    }
  };

  return {
    faqs,
    setFaqs,
    newQuestion,
    setNewQuestion,
    newAnswer,
    setNewAnswer,
    suggestedFaqsList,
    setSuggestedFaqsList,
    handleAddFaq,
    handleSelectSuggestedFaq,
    handleRemoveFaq,
    handleToggleFaqDisplay,
    loadSuggestedFaqs,
  };
};
