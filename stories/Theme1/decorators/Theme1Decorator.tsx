"use client";

import React from "react";
import { I18nProvider } from "@/components/providers/I18nProvider";

/**
 * Wraps Theme1 stories with I18nProvider so tenant components
 * that depend on locale/dir context render correctly.
 * No store or app logic is modified.
 */
export function Theme1Decorator(Story: React.ComponentType) {
  return (
    <I18nProvider>
      <Story />
    </I18nProvider>
  );
}
