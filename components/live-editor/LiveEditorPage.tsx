"use client";

import { useState, useEffect } from "react";
import LiveEditor from "@/components/tenant/live-editor/LiveEditor";
import { EditorProvider } from "@/context/EditorProvider";

export function LiveEditorPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">
            جاري تحميل محرر الموقع...
          </p>
        </div>
      </div>
    );
  }

  return (
    <EditorProvider>
      <LiveEditor />
    </EditorProvider>
  );
}
