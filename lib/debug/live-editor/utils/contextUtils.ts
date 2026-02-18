/**
 * Context Extraction Utilities
 * Extracts context information from code execution
 */

import { EventContext, ComponentInfo, LocationInfo, UserActionInfo } from "../core/types";
import { stackTraceUtils } from "./stackTraceUtils";

/**
 * Extract context from current execution
 */
export function extractContext(
  componentInfo: ComponentInfo,
  userAction?: UserActionInfo
): EventContext {
  const location = extractLocation();
  const user = userAction || extractUserAction();

  return {
    component: componentInfo,
    location,
    user,
  };
}

/**
 * Extract location info from stack trace
 */
function extractLocation(): LocationInfo {
  const stackTrace = stackTraceUtils.getCurrentStackTrace();
  const parsed = stackTraceUtils.parseStackTrace(stackTrace);

  if (parsed.length > 0) {
    const firstFrame = parsed[0];
    return {
      file: stackTraceUtils.extractFileName(firstFrame.file),
      function: firstFrame.function,
      line: firstFrame.line,
    };
  }

  return {
    file: "unknown",
    function: "unknown",
    line: 0,
  };
}

/**
 * Extract user action info
 */
function extractUserAction(): UserActionInfo {
  // Try to get from window location
  const page = typeof window !== "undefined" ? window.location.pathname : "unknown";

  return {
    action: "unknown",
    page,
  };
}

/**
 * Build context object
 */
export function buildContext(
  componentId: string,
  componentType: string,
  variant: string,
  componentName: string,
  userAction?: UserActionInfo,
  editorInfo?: any
): EventContext {
  const component: ComponentInfo = {
    id: componentId,
    type: componentType,
    variant,
    name: componentName,
  };

  const location = extractLocation();
  const user = userAction || extractUserAction();

  const context: EventContext = {
    component,
    location,
    user,
  };

  if (editorInfo) {
    context.editor = editorInfo;
  }

  return context;
}

/**
 * Add location info to context
 */
export function addLocationInfo(context: EventContext, file: string, func: string, line: number): EventContext {
  return {
    ...context,
    location: {
      file,
      function: func,
      line,
    },
  };
}

/**
 * Add component info to context
 */
export function addComponentInfo(
  context: EventContext,
  componentId: string,
  componentType: string,
  variant: string,
  componentName: string
): EventContext {
  return {
    ...context,
    component: {
      id: componentId,
      type: componentType,
      variant,
      name: componentName,
    },
  };
}

export const contextUtils = {
  extractContext,
  buildContext,
  addLocationInfo,
  addComponentInfo,
};
