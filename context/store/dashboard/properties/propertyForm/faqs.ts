import type { PropertyFormStore, FAQ } from "./types";
import { initialFaqs } from "./initialState";

export const createFAQsSlice = (
  set: (partial: Partial<PropertyFormStore>) => void,
  get: () => PropertyFormStore
): Pick<
  PropertyFormStore,
  | "faqs"
  | "newQuestion"
  | "newAnswer"
  | "suggestedFaqsList"
  | "setFaqs"
  | "addFaq"
  | "removeFaq"
  | "updateFaq"
  | "setNewQuestion"
  | "setNewAnswer"
  | "setSuggestedFaqsList"
> => ({
  faqs: initialFaqs,
  newQuestion: "",
  newAnswer: "",
  suggestedFaqsList: [],

  setFaqs: (faqs) => {
    set({ faqs });
  },

  addFaq: (faq) => {
    const current = get();
    set({
      faqs: [...current.faqs, faq],
    });
  },

  removeFaq: (id) => {
    const current = get();
    set({
      faqs: current.faqs.filter((faq) => faq.id !== id),
    });
  },

  updateFaq: (id, updatedFaq) => {
    const current = get();
    set({
      faqs: current.faqs.map((faq) =>
        faq.id === id ? { ...faq, ...updatedFaq } : faq
      ),
    });
  },

  setNewQuestion: (question) => {
    set({ newQuestion: question });
  },

  setNewAnswer: (answer) => {
    set({ newAnswer: answer });
  },

  setSuggestedFaqsList: (list) => {
    set({ suggestedFaqsList: list });
  },
});
