/**
 * AI Debug Panel Component
 * Comprehensive debug panel for AI-friendly debugging
 */

"use client";

import React, { useState } from "react";
import { useDebugPanel } from "@/lib/debug/live-editor/hooks/useDebugPanel";
import { useEventDebug } from "@/lib/debug/live-editor/hooks/useEventDebug";

interface AIDebugPanelProps {
  show: boolean;
  onClose: () => void;
}

export function AIDebugPanel({ show, onClose }: AIDebugPanelProps) {
  const {
    isEnabled,
    enableDebug,
    disableDebug,
    clearDebugData,
    exportDebugData,
    queryAI,
    getDebugData,
  } = useDebugPanel();

  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "traces" | "snapshots" | "dataflow" | "query">("overview");

  const debugData = getDebugData();

  const handleEnableDebug = async () => {
    await enableDebug();
  };

  const handleDisableDebug = () => {
    disableDebug();
  };

  const handleClearData = async () => {
    await clearDebugData();
  };

  const handleExport = async () => {
    try {
      const filePath = await exportDebugData();
      alert(`Debug data exported to: ${filePath}`);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export debug data");
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsQuerying(true);
    try {
      const result = await queryAI(query);
      setQueryResult(result);
      setActiveTab("query");
    } catch (error) {
      console.error("Query error:", error);
      alert("Failed to query AI");
    } finally {
      setIsQuerying(false);
    }
  };

  if (!show || process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">AI Debug Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b bg-gray-50 flex gap-2 flex-wrap">
          <button
            onClick={isEnabled ? handleDisableDebug : handleEnableDebug}
            className={`px-4 py-2 rounded ${
              isEnabled
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isEnabled ? "Disable Debug" : "Enable Debug"}
          </button>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
            disabled={!isEnabled}
          >
            Clear Data
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            disabled={!isEnabled}
          >
            Export for AI
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-2 p-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "events", label: `Events (${debugData.events.length})` },
            { id: "traces", label: `Traces (${debugData.traces.length})` },
            { id: "snapshots", label: `Snapshots (${debugData.snapshots.length})` },
            { id: "dataflow", label: `Data Flow (${debugData.dataFlowHistory.length})` },
            { id: "query", label: "AI Query" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-2xl font-bold">{debugData.events.length}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-2xl font-bold">{debugData.traces.length}</div>
                  <div className="text-sm text-gray-600">Traces</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <div className="text-2xl font-bold">{debugData.snapshots.length}</div>
                  <div className="text-sm text-gray-600">Snapshots</div>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <div className="text-2xl font-bold">{debugData.dataFlowHistory.length}</div>
                  <div className="text-sm text-gray-600">Data Flow</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Status</h3>
                <p>Debug Mode: {isEnabled ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-2">
              {debugData.events.length === 0 ? (
                <p className="text-gray-500">No events recorded yet.</p>
              ) : (
                debugData.events.slice(-50).map((event: any, index: number) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                        {event.eventType}
                      </span>
                      <span className="text-xs text-gray-600">{event.timestamp}</span>
                    </div>
                    <div className="text-sm">{event.summary?.what || "No summary"}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "traces" && (
            <div className="space-y-2">
              {debugData.traces.length === 0 ? (
                <p className="text-gray-500">No traces recorded yet.</p>
              ) : (
                debugData.traces.map((trace: any, index: number) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="font-bold">{trace.componentType} - {trace.componentId}</div>
                    <div className="text-sm text-gray-600">
                      Timeline: {trace.timeline?.length || 0} events
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "snapshots" && (
            <div className="space-y-2">
              {debugData.snapshots.length === 0 ? (
                <p className="text-gray-500">No snapshots recorded yet.</p>
              ) : (
                debugData.snapshots.slice(-20).map((snapshot: any, index: number) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="font-bold">{snapshot.componentType} - {snapshot.type}</div>
                    <div className="text-sm text-gray-600">{snapshot.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "dataflow" && (
            <div className="space-y-2">
              {debugData.dataFlowHistory.length === 0 ? (
                <p className="text-gray-500">No data flow recorded yet.</p>
              ) : (
                debugData.dataFlowHistory.slice(-20).map((flow: any, index: number) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="font-bold">{flow.operationType}</div>
                    <div className="text-sm text-gray-600">{flow.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "query" && (
            <div className="space-y-4">
              <div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about the debug data..."
                  className="w-full p-3 border rounded"
                  rows={4}
                />
                <button
                  onClick={handleQuery}
                  disabled={isQuerying || !query.trim()}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {isQuerying ? "Querying..." : "Query AI"}
                </button>
              </div>

              {queryResult && (
                <div className="border rounded p-4 bg-gray-50">
                  <h3 className="font-bold mb-2">Result</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Problem:</strong> {queryResult.diagnosis?.problem}
                    </div>
                    <div>
                      <strong>Root Cause:</strong> {queryResult.diagnosis?.rootCause}
                    </div>
                    <div>
                      <strong>Solution:</strong> {queryResult.diagnosis?.solution}
                    </div>
                    {queryResult.diagnosis?.steps && (
                      <div>
                        <strong>Steps:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {queryResult.diagnosis.steps.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
