"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { I18nProvider } from "@/components/providers/I18nProvider";

/**
 * Wraps Theme1 stories with AuthProvider and I18nProvider so tenant components
 * that depend on useAuth, locale/dir context render correctly in Storybook.
 */
export function Theme1Decorator(Story: React.ComponentType) {
  return (
    <AuthProvider>
      <I18nProvider>
        <Story />
      </I18nProvider>
    </AuthProvider>
  );
}
