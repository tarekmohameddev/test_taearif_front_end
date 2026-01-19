// ============================================================================
// LiveEditor Header Toolbar Component
// ============================================================================

import React from "react";
import type { DeviceType } from "../types";

interface LiveEditorHeaderProps {
  pageTitle: string;
  selectedDevice: DeviceType;
  deviceDimensions: any;
  screenWidth: number;
  isComponentsSidebarOpen: boolean;
  isStaticPage: boolean;
  showDebugPanel: boolean;
  onToggleComponentsSidebar: () => void;
  onDeviceChange: (device: DeviceType) => void;
  onOpenAddSection: () => void;
  onDeletePage: () => void;
  onToggleDebugPanel: () => void;
  t: (key: string) => string;
}

export function LiveEditorHeader({
  pageTitle,
  selectedDevice,
  deviceDimensions,
  screenWidth,
  isComponentsSidebarOpen,
  isStaticPage,
  showDebugPanel,
  onToggleComponentsSidebar,
  onDeviceChange,
  onOpenAddSection,
  onDeletePage,
  onToggleDebugPanel,
  t,
}: LiveEditorHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Desktop Layout - Single Row */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleComponentsSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title={
              isComponentsSidebarOpen
                ? t("live_editor.hide_components")
                : t("live_editor.show_components")
            }
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isComponentsSidebarOpen
                    ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    : "M13 5l7 7-7 7M5 5l7 7-7 7"
                }
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle} {t("live_editor.editor")}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Device Preview Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onDeviceChange("phone")}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedDevice === "phone"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              title={t("live_editor.mobile_view")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 20H7V4H17V20Z" />
                <path d="M12 18C12.83 18 13.5 17.33 13.5 16.5C13.5 15.67 12.83 15 12 15C11.17 15 10.5 15.67 10.5 16.5C10.5 17.33 11.17 18 12 18Z" />
              </svg>
            </button>
            <button
              onClick={() => onDeviceChange("tablet")}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedDevice === "tablet"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              title={t("live_editor.tablet_view")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0H5C3.9 0 3 0.9 3 2V22C3 23.1 3.9 24 5 24H19C20.1 24 21 23.1 21 22V2C21 0.9 20.1 0 19 0ZM19 22H5V2H19V22Z" />
                <path d="M12 20C12.83 20 13.5 19.33 13.5 18.5C13.5 17.67 12.83 17 12 17C11.17 17 10.5 17.67 10.5 18.5C10.5 19.33 11.17 20 12 20Z" />
              </svg>
            </button>
            <button
              onClick={() => onDeviceChange("laptop")}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedDevice === "laptop"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              title={t("live_editor.desktop_view")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 2H3C1.9 2 1 2.9 1 4V16C1 17.1 1.9 18 3 18H10V20H8V22H16V20H14V18H21C22.1 18 23 17.1 23 16V4C23 2.9 22.1 2 21 2ZM21 16H3V4H21V16Z" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            {deviceDimensions[selectedDevice].name}
          </div>

          <button
            onClick={onOpenAddSection}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t("live_editor.add_new_section")}
          </button>

          {/* زر حذف الصفحة - يختفي للصفحات الثابتة */}
          {!isStaticPage && (
            <button
              onClick={onDeletePage}
              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {t("live_editor.delete_page")}
            </button>
          )}
          {/* Debug Toggle Button - Development Only */}
          {process.env.NODE_ENV === "development" && (
            <button
              onClick={onToggleDebugPanel}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                showDebugPanel
                  ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
              title="Toggle Debug Panel"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              {t("live_editor.debug")}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Layout - Two Rows for screens < 960px */}
      <div className="lg:hidden">
        {/* First Row - Title and Device Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            {/* Components Sidebar Toggle */}
            <button
              onClick={onToggleComponentsSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              title={
                isComponentsSidebarOpen
                  ? t("live_editor.hide_components")
                  : t("live_editor.show_components")
              }
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isComponentsSidebarOpen
                      ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      : "M13 5l7 7-7 7M5 5l7 7-7 7"
                  }
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {pageTitle} {t("live_editor.editor")}
            </h1>
          </div>

          {/* Device Preview Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onDeviceChange("phone")}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedDevice === "phone"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              title={t("live_editor.mobile_view")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 20H7V4H17V20Z" />
                <path d="M12 18C12.83 18 13.5 17.33 13.5 16.5C13.5 15.67 12.83 15 12 15C11.17 15 10.5 15.67 10.5 16.5C10.5 17.33 11.17 18 12 18Z" />
              </svg>
            </button>
            <button
              onClick={() => onDeviceChange("tablet")}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedDevice === "tablet"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              title={t("live_editor.tablet_view")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0H5C3.9 0 3 0.9 3 2V22C3 23.1 3.9 24 5 24H19C20.1 24 21 23.1 21 22V2C21 0.9 20.1 0 19 0ZM19 22H5V2H19V22Z" />
                <path d="M12 20C12.83 20 13.5 19.33 13.5 18.5C13.5 17.67 12.83 17 12 17C11.17 17 10.5 17.67 10.5 18.5C10.5 19.33 11.17 20 12 20Z" />
              </svg>
            </button>
            <button
              onClick={() => onDeviceChange("laptop")}
              className={`p-2 rounded-md transition-all duration-200 ${
                selectedDevice === "laptop"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
              title={t("live_editor.desktop_view")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 2H3C1.9 2 1 2.9 1 4V16C1 17.1 1.9 18 3 18H10V20H8V22H16V20H14V18H21C22.1 18 23 17.1 23 16V4C23 2.9 22.1 2 21 2ZM21 16H3V4H21V16Z" />
              </svg>
            </button>
            <div className="text-sm text-gray-500 font-medium pr-2">
              {deviceDimensions[selectedDevice].name}
            </div>
          </div>
        </div>

        {/* Second Row - Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAddSection}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {t("live_editor.add_new_section")}
            </button>

            <button
              onClick={onDeletePage}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {t("live_editor.delete_page")}
            </button>

            {/* Debug Toggle Button - Development Only */}
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={onToggleDebugPanel}
                className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                  showDebugPanel
                    ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
                title="Toggle Debug Panel"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                {t("live_editor.debug")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
