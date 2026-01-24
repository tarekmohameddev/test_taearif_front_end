import toast from "react-hot-toast";
import type { FAQ } from "../types/propertyForm.types";
import { fetchSuggestedFaqs } from "../services/dataService";
import { usePropertyFormStore } from "@/context/store/dashboard/properties/propertyForm";

export const useFAQs = () => {
  // Use store state instead of local state
  const faqs = usePropertyFormStore((state) => state.faqs);
  const newQuestion = usePropertyFormStore((state) => state.newQuestion);
  const newAnswer = usePropertyFormStore((state) => state.newAnswer);
  const suggestedFaqsList = usePropertyFormStore((state) => state.suggestedFaqsList);
  
  // Get store actions
  const setFaqs = usePropertyFormStore((state) => state.setFaqs);
  const setNewQuestion = usePropertyFormStore((state) => state.setNewQuestion);
  const setNewAnswer = usePropertyFormStore((state) => state.setNewAnswer);
  const setSuggestedFaqsList = usePropertyFormStore((state) => state.setSuggestedFaqsList);
  const addFaq = usePropertyFormStore((state) => state.addFaq);
  const removeFaq = usePropertyFormStore((state) => state.removeFaq);
  const updateFaq = usePropertyFormStore((state) => state.updateFaq);

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

    addFaq(newFaq);
    setNewQuestion("");
    setNewAnswer("");
    toast.success("تم إضافة السؤال بنجاح");
  };

  const handleSelectSuggestedFaq = (suggestedFaq: any) => {
    setNewQuestion(suggestedFaq.question);
  };

  const handleRemoveFaq = (id: number) => {
    removeFaq(id);
    toast.success("تم حذف السؤال");
  };

  const handleToggleFaqDisplay = (id: number) => {
    const faq = faqs.find((f) => f.id === id);
    if (faq) {
      updateFaq(id, { displayOnPage: !faq.displayOnPage });
    }
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
