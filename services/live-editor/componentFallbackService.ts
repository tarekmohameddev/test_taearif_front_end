import React, { lazy } from "react";
import { AVAILABLE_SECTIONS } from "@/components/tenant/live-editor/EditorSidebar";

// دالة إنشاء مكون احتياطي للمكونات غير المعروفة
export const createUnknownComponentFallback = (
  baseName: string,
  componentName: string,
  fallbackFullPath: string,
) => {
  return lazy(() =>
    import(`@/components/tenant/${fallbackFullPath}`).catch(() => ({
      default: (props: any) => {
        const React = require("react");
        return React.createElement(
          "div",
          {
            className:
              "p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg text-center",
          },
          [
            React.createElement(
              "div",
              {
                key: "title",
                className: "text-yellow-600 text-lg font-semibold mb-2",
              },
              `Unknown Component: ${baseName}`,
            ),
            React.createElement(
              "div",
              {
                key: "file",
                className: "text-gray-600 text-sm mb-4",
              },
              `Component file: ${componentName} (fallback: ${fallbackFullPath})`,
            ),
            React.createElement(
              "div",
              {
                key: "desc",
                className: "text-xs text-gray-500",
              },
              "This component type is not recognized. Using fallback.",
            ),
          ],
        );
      },
    })),
  );
};

// دالة إنشاء مكون احتياطي للمكونات المعروفة
export const createKnownComponentFallback = (
  baseName: string,
  componentName: string,
  fullPath: string,
) => {
  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: (props: any) => {
        const React = require("react");
        const componentDisplayName =
          AVAILABLE_SECTIONS.find((s) => s.component === baseName)?.name ||
          baseName;

        const children = [
          React.createElement(
            "div",
            {
              key: "title",
              className: "text-blue-600 text-lg font-semibold mb-2",
            },
            `${componentDisplayName} Component`,
          ),
          React.createElement(
            "div",
            {
              key: "file",
              className: "text-gray-600 text-sm mb-4",
            },
            `Component file: ${componentName} (${fullPath})`,
          ),
          React.createElement(
            "div",
            {
              key: "desc",
              className: "text-xs text-gray-500",
            },
            "This is a placeholder showing that the component structure is working",
          ),
        ];

        if (props.texts?.title) {
          const titleStyle = { color: props.colors?.textColor || "#1F2937" };
          const subtitleStyle = { color: props.colors?.textColor || "#6B7280" };

          children.push(
            React.createElement(
              "div",
              {
                key: "content",
                className: "mt-4 p-3 bg-white rounded border",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "title",
                    className: "font-medium",
                    style: titleStyle,
                  },
                  props.texts.title,
                ),
                props.texts.subtitle &&
                  React.createElement(
                    "div",
                    {
                      key: "subtitle",
                      className: "text-sm mt-1",
                      style: subtitleStyle,
                    },
                    props.texts.subtitle,
                  ),
              ].filter(Boolean),
            ),
          );
        }

        return React.createElement(
          "div",
          {
            className:
              "p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg text-center",
          },
          children,
        );
      },
    })),
  );
};

// دالة إنشاء مكون احتياطي بسيط
export const createSimpleFallback = (
  message: string,
  className: string = "p-4 bg-gray-100 rounded",
) => {
  return lazy(() =>
    Promise.resolve({
      default: (props: any) => {
        const React = require("react");
        return React.createElement(
          "div",
          {
            className,
            style: { padding: "1rem", textAlign: "center" },
          },
          message,
        );
      },
    }),
  );
};

// دالة إنشاء مكون احتياطي مع رسالة خطأ
export const createErrorFallback = (error: string, componentName: string) => {
  return lazy(() =>
    Promise.resolve({
      default: (props: any) => {
        const React = require("react");
        return React.createElement(
          "div",
          {
            className:
              "p-4 bg-red-50 border border-red-200 rounded text-center",
          },
          [
            React.createElement(
              "div",
              {
                key: "error",
                className: "text-red-600 font-medium",
              },
              `Error loading component: ${componentName}`,
            ),
            React.createElement(
              "div",
              {
                key: "message",
                className: "text-red-500 text-sm mt-1",
              },
              error,
            ),
          ],
        );
      },
    }),
  );
};
