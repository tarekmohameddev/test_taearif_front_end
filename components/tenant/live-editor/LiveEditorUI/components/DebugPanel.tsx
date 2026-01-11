// ============================================================================
// Debug Panel Component
// ============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PositionDebugInfo,
  PositionValidation,
  generatePositionReport,
} from "@/services/live-editor/dragDrop/enhanced-position-tracker";
import { positionTracker } from "@/services/live-editor/dragDrop/enhanced-position-tracker";
import { DebugControls } from "@/components/tenant/live-editor/debug/DebugControls";
import {
  toggleLogging,
  getLoggingStatus,
  getLogsCount,
  downloadLogs as downloadFileLogs,
  isDevelopmentMode,
} from "@/lib/fileLogger";

interface DebugPanelProps {
  show: boolean;
  onClose: () => void;
  positionValidation: PositionValidation | null;
  hasChangesMade: boolean;
  pageComponents: any[];
  selectedComponentId: string | null;
  debugInfo: PositionDebugInfo | null;
  onResetPositions: () => void;
  onShowDebugControls: () => void;
  t: (key: string) => string;
}

export function DebugPanel({
  show,
  onClose,
  positionValidation,
  hasChangesMade,
  pageComponents,
  selectedComponentId,
  debugInfo,
  onResetPositions,
  onShowDebugControls,
  t,
}: DebugPanelProps) {
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(false);
  const [logsCount, setLogsCount] = useState(0);

  // Check logging status on mount and when it changes
  useEffect(() => {
    setIsLoggingEnabled(getLoggingStatus());
    setLogsCount(getLogsCount());

    // Update logs count periodically
    const interval = setInterval(() => {
      if (isLoggingEnabled) {
        setLogsCount(getLogsCount());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoggingEnabled]);

  if (!show || process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleToggleLogging = () => {
    const newStatus = toggleLogging();
    setIsLoggingEnabled(newStatus);
    setLogsCount(getLogsCount());
  };

  const handleDownloadLogs = () => {
    if (isLoggingEnabled) {
      downloadFileLogs();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            🔍 {t("live_editor.position_debug_panel")}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onResetPositions}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              title="Reset all positions"
            >
              {t("live_editor.reset")}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-80">
        {/* Position Validation */}
        {positionValidation && (
          <div className="mb-4">
            <div
              className={`text-xs font-medium mb-2 ${
                positionValidation.isValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {t("live_editor.position_validation")}:{" "}
              {positionValidation.isValid
                ? `✅ ${t("live_editor.valid")}`
                : `❌ ${t("live_editor.invalid")}`}
            </div>
            {!positionValidation.isValid && (
              <div className="space-y-1">
                {positionValidation.issues?.map(
                  (issue: string, index: number) => (
                    <div
                      key={index}
                      className="text-xs text-red-600 bg-red-50 p-2 rounded"
                    >
                      {issue}
                    </div>
                  ),
                )}
                {positionValidation.suggestions?.map(
                  (suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="text-xs text-blue-600 bg-blue-50 p-2 rounded"
                    >
                      💡 {suggestion}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {/* Logging Status */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Logging Status
          </div>
          <div
            className={`text-xs p-2 rounded border ${
              isLoggingEnabled
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">{isLoggingEnabled ? "✅" : "⭕"}</span>
                <span className="font-mono">
                  {isLoggingEnabled ? "Logging Enabled" : "Logging Disabled"}
                </span>
              </div>
              {isLoggingEnabled && (
                <span className="text-gray-500">({logsCount} logs)</span>
              )}
            </div>
          </div>
        </div>

        {/* Changes Made Status */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">
            {t("live_editor.changes_status")}
          </div>
          <div
            className={`text-xs p-2 rounded border ${
              hasChangesMade
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">{hasChangesMade ? "✅" : "⭕"}</span>
              <span className="font-mono">
                {hasChangesMade
                  ? t("live_editor.changes_detected")
                  : t("live_editor.no_changes")}
              </span>
            </div>
          </div>
        </div>

        {/* Current Components */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">
            {t("live_editor.current_components")} ({pageComponents.length})
          </div>
          <div className="space-y-1">
            {pageComponents.map((comp: any, index: number) => (
              <div
                key={comp.id}
                className={`text-xs p-2 rounded border ${
                  selectedComponentId === comp.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="font-mono">
                  {index}: {comp.componentName || comp.name || "Unknown"}
                </div>
                <div className="text-gray-500">
                  ID: {comp.id.slice(0, 8)}... | Position:{" "}
                  {comp.position ?? "undefined"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Debug Info */}
        {debugInfo && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">
              {t("live_editor.last_move_operation")}
            </div>
            <div className="text-xs bg-gray-50 p-2 rounded border">
              <div>
                <strong>{t("live_editor.component")}:</strong>{" "}
                {typeof debugInfo.operation === "object" &&
                debugInfo.operation?.componentName
                  ? debugInfo.operation.componentName
                  : String(debugInfo.operation)}
              </div>
              <div>
                <strong>{t("live_editor.from")}:</strong>{" "}
                {typeof debugInfo.operation === "object" &&
                debugInfo.operation?.sourceIndex
                  ? debugInfo.operation.sourceIndex
                  : "N/A"}{" "}
                → <strong>{t("live_editor.to")}:</strong>{" "}
                {debugInfo.calculatedIndex}
              </div>
              <div>
                <strong>{t("live_editor.final")}:</strong>{" "}
                {debugInfo.finalIndex}
              </div>
              {debugInfo.adjustmentReason && (
                <div>
                  <strong>{t("live_editor.reason")}:</strong>{" "}
                  {debugInfo.adjustmentReason}
                </div>
              )}
              <div>
                <strong>{t("live_editor.timestamp")}:</strong>{" "}
                {typeof debugInfo.operation === "object" &&
                debugInfo.operation?.timestamp
                  ? new Date(debugInfo.operation.timestamp).toLocaleTimeString()
                  : "N/A"}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          {/* Toggle Logging Button */}
          <button
            onClick={handleToggleLogging}
            className={`w-full text-xs px-3 py-2 text-white rounded transition-colors ${
              isLoggingEnabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {isLoggingEnabled ? "✅ Logging Enabled" : "⭕ Logging Disabled"}
          </button>

          {/* Download Logs Button (only when logging is enabled) */}
          {isLoggingEnabled && (
            <button
              onClick={handleDownloadLogs}
              className="w-full text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={logsCount === 0}
            >
              📥 Download Logs ({logsCount})
            </button>
          )}

          <button
            onClick={() => {
              const report = generatePositionReport();
            }}
            className="w-full text-xs px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {t("live_editor.generate_full_report")}
          </button>
          <button
            onClick={() => {
              positionTracker.setDebugMode(!positionTracker["debugMode"]);
            }}
            className="w-full text-xs px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            {t("live_editor.toggle_verbose_logging")}
          </button>
          <button
            onClick={onShowDebugControls}
            className="w-full text-xs px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {t("live_editor.debug_changes")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
