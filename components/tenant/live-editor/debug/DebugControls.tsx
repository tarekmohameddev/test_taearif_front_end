"use client";

import React, { useState } from "react";
import {
  clearDebugLog,
  downloadDebugLog,
  getDebugLogs,
  debugLogger,
  getChangeLogsAsString,
  getAllChangeLogs,
  clearChangeLogs,
} from "@/lib/debugLogger";

interface DebugControlsProps {
  onClose?: () => void;
}

export const DebugControls: React.FC<DebugControlsProps> = ({ onClose }) => {
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [showChangeLogs, setShowChangeLogs] = useState(false);
  const [changeLogs, setChangeLogs] = useState<any[]>([]);

  const handleClearLog = () => {
    clearDebugLog();
    alert("Debug log cleared!");
  };

  const handleDownloadLog = () => {
    downloadDebugLog();
  };

  const handleShowLogs = () => {
    const currentLogs = getDebugLogs();
    setLogs(currentLogs);
    setShowLogs(true);
  };

  const handleShowChangeLogs = () => {
    const currentChangeLogs = getAllChangeLogs();
    setChangeLogs(currentChangeLogs);
    setShowChangeLogs(true);
  };

  const handleClearChangeLogs = () => {
    clearChangeLogs();
    alert("Change logs cleared!");
  };

  const handleDownloadChangeLogs = () => {
    const changeLogsString = getChangeLogsAsString();
    const blob = new Blob([changeLogsString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `changes-debug-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Changes debug info saved to file!");
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold">Debug Controls</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <div className="space-y-2">
          <button
            onClick={handleShowChangeLogs}
            className="w-full px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Show Changes ({changeLogs.length})
          </button>
          <button
            onClick={handleDownloadChangeLogs}
            className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download Changes
          </button>
          <button
            onClick={handleClearChangeLogs}
            className="w-full px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Changes
          </button>
        </div>
      </div>

      {/* Change Logs Modal */}
      {showChangeLogs && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">
                Changes Detected ({changeLogs.length})
              </h3>
              <button
                onClick={() => setShowChangeLogs(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {changeLogs.length === 0 ? (
                <p className="text-gray-500">
                  No changes detected yet. Try modifying a component.
                </p>
              ) : (
                <div className="space-y-6">
                  {changeLogs.map((changeLog, index) => (
                    <div key={index} className="border rounded p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-mono bg-blue-100 px-2 py-1 rounded">
                          {changeLog.timestamp}
                        </span>
                        <span className="text-xs font-mono bg-green-100 px-2 py-1 rounded">
                          {changeLog.componentName}
                        </span>
                        <span className="text-xs font-mono bg-yellow-100 px-2 py-1 rounded">
                          {changeLog.changeType}
                        </span>
                        <span className="text-xs font-mono bg-purple-100 px-2 py-1 rounded">
                          ID: {changeLog.componentId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-red-600 mb-2">
                            BEFORE:
                          </h4>
                          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-60">
                            {JSON.stringify(changeLog.before, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-green-600 mb-2">
                            AFTER:
                          </h4>
                          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-60">
                            {JSON.stringify(changeLog.after, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
