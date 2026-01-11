/**
 * File-based logging system for Live Editor
 * نظام logging متقدم يكتب في ملفات بدلاً من console.log
 * 
 * Features:
 * - Writes logs to files automatically
 * - Before/after state tracking
 * - Component-specific logging
 * - Flow tracking
 * - Automatic file management
 */

interface LogEntry {
  timestamp: string;
  level: "INFO" | "DEBUG" | "WARN" | "ERROR";
  source: string;
  action: string;
  phase: "BEFORE" | "AFTER" | "DURING";
  componentId?: string;
  componentName?: string;
  componentType?: string;
  data?: any;
  error?: any;
}

interface BeforeAfterLog {
  timestamp: string;
  action: string;
  componentId?: string;
  componentName?: string;
  componentType?: string;
  before: any;
  after: any;
}

class FileLogger {
  private logs: LogEntry[] = [];
  private beforeAfterLogs: BeforeAfterLog[] = [];
  private maxLogs = 5000; // Maximum logs in memory
  private flushInterval: NodeJS.Timeout | null = null;
  private isEnabled: boolean;
  private sessionId: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === "development" || typeof window !== "undefined";
    this.sessionId = this.generateSessionId();
    
    if (this.isEnabled && typeof window !== "undefined") {
      // Auto-flush logs every 5 seconds
      this.flushInterval = setInterval(() => {
        this.flushToFile();
      }, 5000);

      // Flush on page unload
      window.addEventListener("beforeunload", () => {
        this.flushToFile();
      });
    }
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
  }

  private formatLogEntry(entry: LogEntry): string {
    const lines: string[] = [];
    
    lines.push(`[${entry.timestamp}] [${entry.level}] [${entry.source}] [${entry.action}] [${entry.phase}]`);
    
    if (entry.componentId) {
      lines.push(`Component ID: ${entry.componentId}`);
    }
    if (entry.componentName) {
      lines.push(`Component Name: ${entry.componentName}`);
    }
    if (entry.componentType) {
      lines.push(`Component Type: ${entry.componentType}`);
    }
    
    if (entry.data) {
      try {
        const dataStr = JSON.stringify(entry.data, null, 2);
        lines.push(`Data:\n${dataStr}`);
      } catch (error) {
        lines.push(`Data: ${String(entry.data)}`);
      }
    }
    
    if (entry.error) {
      try {
        const errorStr = JSON.stringify(entry.error, null, 2);
        lines.push(`Error:\n${errorStr}`);
      } catch (error) {
        lines.push(`Error: ${String(entry.error)}`);
      }
    }
    
    lines.push("=".repeat(80));
    lines.push("");
    
    return lines.join("\n");
  }

  private formatBeforeAfterLog(log: BeforeAfterLog): string {
    const lines: string[] = [];
    
    lines.push(`[${log.timestamp}] [BEFORE_AFTER] [${log.action}]`);
    
    if (log.componentId) {
      lines.push(`Component ID: ${log.componentId}`);
    }
    if (log.componentName) {
      lines.push(`Component Name: ${log.componentName}`);
    }
    if (log.componentType) {
      lines.push(`Component Type: ${log.componentType}`);
    }
    
    lines.push("\n--- BEFORE ---");
    try {
      const beforeStr = JSON.stringify(log.before, null, 2);
      lines.push(beforeStr);
    } catch (error) {
      lines.push(String(log.before));
    }
    
    lines.push("\n--- AFTER ---");
    try {
      const afterStr = JSON.stringify(log.after, null, 2);
      lines.push(afterStr);
    } catch (error) {
      lines.push(String(log.after));
    }
    
    lines.push("=".repeat(80));
    lines.push("");
    
    return lines.join("\n");
  }

  private addLog(entry: LogEntry) {
    if (!this.isEnabled) return;
    
    this.logs.push(entry);
    
    // Limit logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Also log to console for immediate feedback
    const consoleMethod = entry.level === "ERROR" ? console.error 
                        : entry.level === "WARN" ? console.warn
                        : entry.level === "DEBUG" ? console.debug
                        : console.log;
    
    const emoji = entry.phase === "BEFORE" ? "🔵" 
                 : entry.phase === "AFTER" ? "🟢"
                 : "🟡";
    
    consoleMethod(
      `${emoji} [${entry.source}] [${entry.action}] [${entry.phase}]`,
      entry.componentId ? `[ID:${entry.componentId}]` : "",
      entry.componentName ? `[${entry.componentName}]` : "",
      entry.data || ""
    );
  }

  /**
   * Log before an operation
   */
  logBefore(
    source: string,
    action: string,
    data?: any,
    componentInfo?: {
      componentId?: string;
      componentName?: string;
      componentType?: string;
    }
  ) {
    this.addLog({
      timestamp: this.formatTimestamp(),
      level: "INFO",
      source,
      action,
      phase: "BEFORE",
      ...componentInfo,
      data,
    });
  }

  /**
   * Log after an operation
   */
  logAfter(
    source: string,
    action: string,
    data?: any,
    componentInfo?: {
      componentId?: string;
      componentName?: string;
      componentType?: string;
    }
  ) {
    this.addLog({
      timestamp: this.formatTimestamp(),
      level: "INFO",
      source,
      action,
      phase: "AFTER",
      ...componentInfo,
      data,
    });
  }

  /**
   * Log during an operation
   */
  logDuring(
    source: string,
    action: string,
    data?: any,
    componentInfo?: {
      componentId?: string;
      componentName?: string;
      componentType?: string;
    }
  ) {
    this.addLog({
      timestamp: this.formatTimestamp(),
      level: "DEBUG",
      source,
      action,
      phase: "DURING",
      ...componentInfo,
      data,
    });
  }

  /**
   * Log before/after comparison
   */
  logBeforeAfter(
    action: string,
    before: any,
    after: any,
    componentInfo?: {
      componentId?: string;
      componentName?: string;
      componentType?: string;
    }
  ) {
    if (!this.isEnabled) return;
    
    const log: BeforeAfterLog = {
      timestamp: this.formatTimestamp(),
      action,
      ...componentInfo,
      before,
      after,
    };
    
    this.beforeAfterLogs.push(log);
    
    // Limit logs
    if (this.beforeAfterLogs.length > 1000) {
      this.beforeAfterLogs = this.beforeAfterLogs.slice(-1000);
    }
    
    // Also log to console
    console.log(`🔄 [BEFORE_AFTER] [${action}]`, componentInfo);
    console.log("--- BEFORE ---", before);
    console.log("--- AFTER ---", after);
  }

  /**
   * Log error
   */
  logError(
    source: string,
    action: string,
    error: any,
    componentInfo?: {
      componentId?: string;
      componentName?: string;
      componentType?: string;
    }
  ) {
    this.addLog({
      timestamp: this.formatTimestamp(),
      level: "ERROR",
      source,
      action,
      phase: "AFTER",
      ...componentInfo,
      error,
    });
  }

  /**
   * Get all logs as formatted string
   */
  getLogsAsString(): string {
    if (!this.isEnabled || this.logs.length === 0) {
      return `=== NO LOGS ===\nSession ID: ${this.sessionId}\n\n`;
    }
    
    let result = `=== LIVE EDITOR LOGS ===\n`;
    result += `Session ID: ${this.sessionId}\n`;
    result += `Total Logs: ${this.logs.length}\n`;
    result += `Generated: ${this.formatTimestamp()}\n\n`;
    
    for (const log of this.logs) {
      result += this.formatLogEntry(log);
    }
    
    // Add before/after logs
    if (this.beforeAfterLogs.length > 0) {
      result += `\n=== BEFORE/AFTER COMPARISONS ===\n`;
      result += `Total Comparisons: ${this.beforeAfterLogs.length}\n\n`;
      
      for (const log of this.beforeAfterLogs) {
        result += this.formatBeforeAfterLog(log);
      }
    }
    
    return result;
  }

  /**
   * Flush logs to file (download)
   */
  flushToFile() {
    if (!this.isEnabled || typeof window === "undefined") return;
    
    if (this.logs.length === 0 && this.beforeAfterLogs.length === 0) {
      return; // No logs to flush
    }
    
    const logsString = this.getLogsAsString();
    const blob = new Blob([logsString], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    // Store in localStorage for later download
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const key = `live-editor-logs-${timestamp}`;
      localStorage.setItem(key, logsString);
      
      // Keep only last 5 log entries
      const allKeys = Object.keys(localStorage)
        .filter(k => k.startsWith("live-editor-logs-"))
        .sort()
        .reverse();
      
      if (allKeys.length > 5) {
        allKeys.slice(5).forEach(k => localStorage.removeItem(k));
      }
    } catch (error) {
      console.error("Failed to save logs to localStorage:", error);
    }
    
    URL.revokeObjectURL(url);
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    if (!this.isEnabled || typeof window === "undefined") return;
    
    const logsString = this.getLogsAsString();
    const blob = new Blob([logsString], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    a.href = url;
    a.download = `live-editor-logs-${timestamp}-${this.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Clear logs after download if requested
    // this.clearLogs();
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    if (this.isEnabled) {
      this.logs = [];
      this.beforeAfterLogs = [];
      console.log("🧹 Logs cleared");
    }
  }

  /**
   * Get logs count
   */
  getLogsCount(): number {
    return this.logs.length;
  }

  /**
   * Get before/after logs count
   */
  getBeforeAfterLogsCount(): number {
    return this.beforeAfterLogs.length;
  }
}

// Export singleton instance
export const fileLogger = new FileLogger();

// Export helper functions for easier usage
export const logBefore = (
  source: string,
  action: string,
  data?: any,
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
) => {
  fileLogger.logBefore(source, action, data, componentInfo);
};

export const logAfter = (
  source: string,
  action: string,
  data?: any,
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
) => {
  fileLogger.logAfter(source, action, data, componentInfo);
};

export const logDuring = (
  source: string,
  action: string,
  data?: any,
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
) => {
  fileLogger.logDuring(source, action, data, componentInfo);
};

export const logBeforeAfter = (
  action: string,
  before: any,
  after: any,
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
) => {
  fileLogger.logBeforeAfter(action, before, after, componentInfo);
};

export const logError = (
  source: string,
  action: string,
  error: any,
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
) => {
  fileLogger.logError(source, action, error, componentInfo);
};

export const downloadLogs = () => {
  fileLogger.downloadLogs();
};

export const clearLogs = () => {
  fileLogger.clearLogs();
};

export const getLogsAsString = () => {
  return fileLogger.getLogsAsString();
};

export const getLogsCount = () => {
  return fileLogger.getLogsCount();
};
