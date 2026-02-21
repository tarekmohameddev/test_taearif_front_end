/**
 * Stack Trace Parsing Utilities
 * Parses stack traces to extract file names, function names, and line numbers
 */

export interface ParsedStackTrace {
  file: string;
  function: string;
  line: number;
  column?: number;
}

/**
 * Parse stack trace
 */
export function parseStackTrace(stackTrace: string): ParsedStackTrace[] {
  const lines = stackTrace.split("\n");
  const parsed: ParsedStackTrace[] = [];

  lines.forEach((line) => {
    const parsedLine = parseStackTraceLine(line);
    if (parsedLine) {
      parsed.push(parsedLine);
    }
  });

  return parsed;
}

/**
 * Parse single stack trace line
 */
function parseStackTraceLine(line: string): ParsedStackTrace | null {
  // Match patterns like:
  // at functionName (file:///path/to/file.ts:123:45)
  // at Object.functionName (file:///path/to/file.ts:123:45)
  // at file:///path/to/file.ts:123:45

  const patterns = [
    // Pattern: at functionName (file:///path:line:col)
    /at\s+(?:[^\s]+\s+)?([^\s]+)\s+\(([^:]+):(\d+):(\d+)\)/,
    // Pattern: at file:///path:line:col
    /at\s+([^:]+):(\d+):(\d+)/,
    // Pattern: at functionName (file:///path:line)
    /at\s+(?:[^\s]+\s+)?([^\s]+)\s+\(([^:]+):(\d+)\)/,
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      if (match.length === 5) {
        // First pattern
        return {
          function: match[1],
          file: match[2],
          line: parseInt(match[3], 10),
          column: parseInt(match[4], 10),
        };
      } else if (match.length === 4) {
        // Second pattern
        return {
          function: "anonymous",
          file: match[1],
          line: parseInt(match[2], 10),
          column: parseInt(match[3], 10),
        };
      } else if (match.length === 4) {
        // Third pattern
        return {
          function: match[1],
          file: match[2],
          line: parseInt(match[3], 10),
        };
      }
    }
  }

  return null;
}

/**
 * Extract file name from path
 */
export function extractFileName(filePath: string): string {
  return filePath.split("/").pop() || filePath.split("\\").pop() || filePath;
}

/**
 * Extract function name from stack trace line
 */
export function extractFunctionName(line: string): string {
  const match = line.match(/at\s+(?:[^\s]+\s+)?([^\s]+)/);
  return match ? match[1] : "anonymous";
}

/**
 * Extract line number from stack trace line
 */
export function extractLineNumber(line: string): number | null {
  const match = line.match(/:(\d+)(?::(\d+))?/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Get current stack trace
 */
export function getCurrentStackTrace(): string {
  const error = new Error();
  return error.stack || "";
}

export const stackTraceUtils = {
  parseStackTrace,
  extractFileName,
  extractFunctionName,
  extractLineNumber,
  getCurrentStackTrace,
};
