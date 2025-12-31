import { useEditorStore } from "@/context-liveeditor/editorStore";

export const useInputHandlers = () => {
  const { updateTempField } = useEditorStore();

  const handleInputChange = (
    field: "texts" | "colors" | "settings",
    key: string,
    value: string | boolean | number,
  ) => {
    updateTempField(field, key, value);
  };

  return {
    handleInputChange,
  };
};
