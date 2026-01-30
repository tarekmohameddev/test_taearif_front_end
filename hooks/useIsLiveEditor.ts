"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook to detect if component is rendered inside live editor iframe
 * @returns {boolean} true if in live editor, false otherwise
 */
export function useIsLiveEditor(): boolean {
  const [isLiveEditor, setIsLiveEditor] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're in an iframe (live editor preview)
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    
    // Check if pathname includes live-editor
    const pathnameCheck = pathname?.includes("/live-editor");
    
    setIsLiveEditor(inIframe || pathnameCheck || false);
  }, [pathname]);

  return isLiveEditor;
}
