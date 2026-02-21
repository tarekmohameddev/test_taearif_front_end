/**
 * Summary Formatter
 * Formats AI-friendly summaries
 */

import { AISummary } from "../core/types";

/**
 * Format AI-friendly summary
 */
export function formatSummary(summary: AISummary): string {
  const lines: string[] = [];

  lines.push(`WHAT: ${summary.what}`);
  lines.push(`WHERE: ${summary.where}`);
  lines.push(`WHEN: ${summary.when}`);
  lines.push(`WHY: ${summary.why}`);
  lines.push(`HOW: ${summary.how}`);
  lines.push(`IMPACT: ${summary.impact}`);

  if (summary.nextSteps.length > 0) {
    lines.push(`NEXT STEPS:`);
    summary.nextSteps.forEach((step, index) => {
      lines.push(`  ${index + 1}. ${step}`);
    });
  }

  return lines.join("\n");
}

/**
 * Format summary as JSON
 */
export function formatSummaryAsJSON(summary: AISummary): string {
  return JSON.stringify(summary, null, 2);
}

/**
 * Format summary for console
 */
export function formatSummaryForConsole(summary: AISummary): void {
  console.group("📋 Event Summary");
  console.log("What:", summary.what);
  console.log("Where:", summary.where);
  console.log("When:", summary.when);
  console.log("Why:", summary.why);
  console.log("How:", summary.how);
  console.log("Impact:", summary.impact);
  if (summary.nextSteps.length > 0) {
    console.log("Next Steps:", summary.nextSteps);
  }
  console.groupEnd();
}

export const summaryFormatter = {
  formatSummary,
  formatSummaryAsJSON,
  formatSummaryForConsole,
};
