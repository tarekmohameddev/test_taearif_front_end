"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useCallback,
} from "react";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import toast from "react-hot-toast";

// تعريف النوع للدالة التي نريد تمريرها
type OpenDialogFn = () => void;

interface EditorContextType {
  requestSave: () => void;
  setOpenSaveDialog: (fn: OpenDialogFn) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [openSaveDialogFn, setOpenSaveDialogFn] = useState<OpenDialogFn>(
    () => () => {},
  );
  const [showDialog, setShowDialog] = useState(false);

  const requestSave = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const confirmSave = () => {
    setShowDialog(false);
    openSaveDialogFn(); // تنفيذ دالة الحفظ
    toast.success("Changes saved successfully!"); // عرض رسالة نجاح
  };

  const handleSetOpenSaveDialog = useCallback((fn: OpenDialogFn) => {
    setOpenSaveDialogFn(() => fn);
  }, []);

  const value = {
    requestSave,
    setOpenSaveDialog: handleSetOpenSaveDialog,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </EditorContext.Provider>
  );
};

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
}
