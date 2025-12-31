import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";

interface UseCurrentPageEffectProps {
  slug: string;
}

export const useCurrentPageEffect = ({ slug }: UseCurrentPageEffectProps) => {
  // Update current page in store
  useEffect(() => {
    useEditorStore.getState().setCurrentPage(slug);
  }, [slug]);
};
