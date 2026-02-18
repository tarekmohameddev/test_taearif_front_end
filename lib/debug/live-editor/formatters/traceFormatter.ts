/**
 * Trace Formatter
 * Formats execution traces
 */

import { ExecutionTrace } from "../core/types";

/**
 * Format execution trace
 */
export function formatTrace(trace: ExecutionTrace): string {
  const lines: string[] = [];

  lines.push("=== Execution Trace ===");
  lines.push("");

  trace.steps.forEach((step) => {
    lines.push(`Step ${step.step}: ${step.action}`);
    lines.push(`  Location: ${step.location}`);
    lines.push(`  Timestamp: ${step.timestamp}`);
    if (step.data) {
      lines.push(`  Data: ${JSON.stringify(step.data, null, 2)}`);
    }
    lines.push("");
  });

  if (trace.stackTrace.length > 0) {
    lines.push("=== Stack Trace ===");
    trace.stackTrace.forEach((line) => {
      lines.push(line);
    });
  }

  return lines.join("\n");
}

/**
 * Format stack trace
 */
export function formatStackTrace(stackTrace: string[]): string {
  return stackTrace.join("\n");
}

/**
 * Format step-by-step trace
 */
export function formatStepByStep(trace: ExecutionTrace): string {
  const lines: string[] = [];

  lines.push("Execution Steps:");
  lines.push("");

  trace.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step.action} (${step.location})`);
  });

  return lines.join("\n");
}

export const traceFormatter = {
  formatTrace,
  formatStackTrace,
  formatStepByStep,
};
