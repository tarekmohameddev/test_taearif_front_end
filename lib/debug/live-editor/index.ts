/**
 * Main Export File for AI-Friendly Debugger System
 * Exports all hooks, trackers, formatters, analyzers, queries, utils, config, and store
 */

// Core
export * from "./core/types";
export * from "./core/config";
export * from "./core/debugStore";
export * from "./core/eventEmitter";

// Trackers
export * from "./trackers/componentTracker";
export * from "./trackers/eventTracker";
export * from "./trackers/dataFlowTracker";
export * from "./trackers/storeTracker";
export * from "./trackers/performanceTracker";

// Formatters
export * from "./formatters/eventFormatter";
export * from "./formatters/dataFormatter";
export * from "./formatters/summaryFormatter";
export * from "./formatters/traceFormatter";

// Analyzers
export * from "./analyzers/dataFlowAnalyzer";
export * from "./analyzers/priorityAnalyzer";
export * from "./analyzers/diffAnalyzer";

// Queries
// Note: Queries are server-only (use fileReader which uses fs/promises)
// Use API routes (/api/debug/query) for client-side access
// export * from "./queries/aiQueryInterface";
// export * from "./queries/eventSearcher";
// export * from "./queries/componentTracer";
// export * from "./queries/problemDiagnoser";

// Hooks
export * from "./hooks/useComponentDebug";
export * from "./hooks/useEventDebug";
export * from "./hooks/useDataFlowDebug";
export * from "./hooks/useDebugPanel";

// Utils
// Note: fileWriter and exportForAI are server-only (use fs/promises)
// Use API routes (/api/debug/*) for client-side access
export * from "./utils/fileReader";
export * from "./utils/snapshotUtils";
export * from "./utils/diffUtils";
export * from "./utils/stackTraceUtils";
export * from "./utils/contextUtils";
