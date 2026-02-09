import { useState } from "react";
import { PageFormData } from "../types/types";

const initialFormData: PageFormData = {
  slug: "",
  TitleAr: "",
  TitleEn: "",
  DescriptionAr: "",
  DescriptionEn: "",
  KeywordsAr: "",
  KeywordsEn: "",
  Author: "",
  AuthorEn: "",
  Robots: "",
  RobotsEn: "",
  "og:title": "",
  "og:description": "",
  "og:keywords": "",
  "og:author": "",
  "og:robots": "",
  "og:url": "",
  "og:image": "",
  "og:type": "",
  "og:locale": "",
  "og:locale:alternate": "",
  "og:site_name": "",
  "og:image:width": "",
  "og:image:height": "",
  "og:image:type": "",
  "og:image:alt": "",
};

export function usePageForm() {
  const [formData, setFormData] = useState<PageFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
    setShowAdvanced(false);
  };

  const addPageToLocalList = (
    setRecentlyAddedPages: React.Dispatch<React.SetStateAction<string[]>>,
    pageSlug: string,
  ) => {
    setRecentlyAddedPages((prev) => [...prev, pageSlug]);
  };

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    showAdvanced,
    setShowAdvanced,
    resetForm,
    addPageToLocalList,
  };
}
