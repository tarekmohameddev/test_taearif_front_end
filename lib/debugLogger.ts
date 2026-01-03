// Centralized debug logging system for browser
interface DebugLog {
  timestamp: string;
  source: string;
  action: string;
  data: any;
  componentId?: string;
  componentName?: string;
  componentType?: string;
}

interface ChangeLog {
  timestamp: string;
  componentId: string;
  componentName: string;
  componentType: string;
  before: any;
  after: any;
  changeType: "GLOBAL_HEADER" | "GLOBAL_FOOTER" | "COMPONENT_UPDATE";
}

class DebugLogger {
  private logs: DebugLog[] = [];
  private changeLogs: ChangeLog[] = [];
  private isEnabled: boolean;
  private maxLogs: number = 1000; // Limit logs to prevent memory issues
  private previousStates: Map<string, any> = new Map();

  constructor() {
    this.isEnabled = process.env.NODE_ENV === "development";

    // Initialize logs array
    if (this.isEnabled) {
      this.logs = [];
    }
  }

  private formatTimestamp(): string {
    return new Date().toISOString().replace("T", " ").replace("Z", "");
  }

  private formatLog(log: DebugLog): string {
    const timestamp = `[${log.timestamp}]`;
    const source = `[${log.source}]`;
    const action = `[${log.action}]`;
    const component = log.componentId ? `[ID:${log.componentId}]` : "";
    const componentName = log.componentName
      ? `[NAME:${log.componentName}]`
      : "";
    const componentType = log.componentType
      ? `[TYPE:${log.componentType}]`
      : "";

    let dataStr = "";
    if (log.data) {
      try {
        dataStr = JSON.stringify(log.data, null, 2);
      } catch (error) {
        dataStr = String(log.data);
      }
    }

    return `${timestamp} ${source} ${action} ${component} ${componentName} ${componentType}\n${dataStr}\n${"=".repeat(80)}\n\n`;
  }

  log(
    source: string,
    action: string,
    data: any,
    componentInfo?: {
      componentId?: string;
      componentName?: string;
      componentType?: string;
    },
  ) {
    if (!this.isEnabled) return;

    const log: DebugLog = {
      timestamp: this.formatTimestamp(),
      source,
      action,
      data,
      ...componentInfo,
    };

    // Add to logs array
    this.logs.push(log);

    // Limit logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console for immediate feedback
  }

  // Helper methods for common logging scenarios
  logComponentAdd(
    componentId: string,
    componentName: string,
    componentType: string,
    data: any,
  ) {
    this.log("COMPONENT_ADD", "ADD_COMPONENT", data, {
      componentId,
      componentName,
      componentType,
    });
  }

  logComponentChange(
    componentId: string,
    oldName: string,
    newName: string,
    data: any,
  ) {
    this.log(
      "COMPONENT_CHANGE",
      "CHANGE_COMPONENT",
      {
        oldComponentName: oldName,
        newComponentName: newName,
        data,
      },
      {
        componentId,
        componentName: newName,
      },
    );
  }

  logEditorStore(
    action: string,
    componentId: string,
    componentName: string,
    data: any,
  ) {
    this.log("EDITOR_STORE", action, data, {
      componentId,
      componentName,
    });
  }

  logTenantStore(
    action: string,
    componentId: string,
    componentName: string,
    data: any,
  ) {
    this.log("TENANT_STORE", action, data, {
      componentId,
      componentName,
    });
  }

  logComponentRender(
    componentId: string,
    componentName: string,
    componentType: string,
    data: any,
  ) {
    this.log("COMPONENT_RENDER", "RENDER", data, {
      componentId,
      componentName,
      componentType,
    });
  }

  logSidebar(
    action: string,
    componentId: string,
    componentName: string,
    data: any,
  ) {
    this.log("SIDEBAR", action, data, {
      componentId,
      componentName,
    });
  }

  logUserAction(
    action: string,
    componentId: string,
    componentName: string,
    data: any,
  ) {
    this.log("USER_ACTION", action, data, {
      componentId,
      componentName,
    });
  }

  // New method to log changes with before/after
  logChange(
    componentId: string,
    componentName: string,
    componentType: string,
    newData: any,
    changeType: "GLOBAL_HEADER" | "GLOBAL_FOOTER" | "COMPONENT_UPDATE",
  ) {
    if (!this.isEnabled) return;

    const key = `${componentId}_${componentName}`;
    const previousData = this.previousStates.get(key);

    // Always log the first time (when previousData is undefined)
    // Or log if there's a change
    if (
      !previousData ||
      JSON.stringify(previousData) !== JSON.stringify(newData)
    ) {
      const changeLog: ChangeLog = {
        timestamp: this.formatTimestamp(),
        componentId,
        componentName,
        componentType,
        before: previousData || {},
        after: newData,
        changeType,
      };

      this.changeLogs.push(changeLog);

      // Limit change logs to prevent memory issues
      if (this.changeLogs.length > this.maxLogs) {
        this.changeLogs = this.changeLogs.slice(-this.maxLogs);
      }

      // Also log to console for immediate feedback
    }

    // Update the previous state
    this.previousStates.set(key, JSON.parse(JSON.stringify(newData)));
  }

  // Method to get change logs as formatted string
  getChangeLogsAsString(): string {
    if (!this.isEnabled || this.changeLogs.length === 0) {
      return "=== NO CHANGES DETECTED ===\n\n";
    }

    let result = "=== CHANGES DETECTED ===\n\n";
    for (const changeLog of this.changeLogs) {
      result += this.formatChangeLog(changeLog);
    }
    return result;
  }

  private formatChangeLog(changeLog: ChangeLog): string {
    const timestamp = `[${changeLog.timestamp}]`;
    const component = `[ID:${changeLog.componentId}]`;
    const componentName = `[NAME:${changeLog.componentName}]`;
    const componentType = `[TYPE:${changeLog.componentType}]`;
    const changeType = `[CHANGE:${changeLog.changeType}]`;

    let beforeStr = "";
    let afterStr = "";

    try {
      beforeStr = JSON.stringify(changeLog.before, null, 2);
      afterStr = JSON.stringify(changeLog.after, null, 2);
    } catch (error) {
      beforeStr = String(changeLog.before);
      afterStr = String(changeLog.after);
    }

    return `${timestamp} ${component} ${componentName} ${componentType} ${changeType}\n\nBEFORE:\n${beforeStr}\n\nAFTER:\n${afterStr}\n${"=".repeat(80)}\n\n`;
  }

  // Get all change logs as array
  getAllChangeLogs(): ChangeLog[] {
    return [...this.changeLogs];
  }

  // Clear change logs
  clearChangeLogs() {
    if (this.isEnabled) {
      this.changeLogs = [];
      this.previousStates.clear();
    }
  }

  // Get all logs as formatted string
  getLogsAsString(): string {
    if (!this.isEnabled) return "";

    let result = "=== DEBUG LOG STARTED ===\n\n";
    for (const log of this.logs) {
      result += this.formatLog(log);
    }
    return result;
  }

  // Get all logs as array
  getAllLogs(): DebugLog[] {
    return [...this.logs];
  }

  // Download logs as file
  downloadLogs() {
    if (!this.isEnabled) return;

    const logsString = this.getLogsAsString();
    const blob = new Blob([logsString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debug-log-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  clearLog() {
    if (this.isEnabled) {
      this.logs = [];
      console.log("🔍 Debug log cleared");
    }
  }
}

// Export singleton instance
export const debugLogger = new DebugLogger();

// Export helper functions for easier usage
export const logComponentAdd = (
  componentId: string,
  componentName: string,
  componentType: string,
  data: any,
) => {
  debugLogger.logComponentAdd(componentId, componentName, componentType, data);
};

export const logComponentChange = (
  componentId: string,
  oldName: string,
  newName: string,
  data: any,
) => {
  debugLogger.logComponentChange(componentId, oldName, newName, data);
};

export const logEditorStore = (
  action: string,
  componentId: string,
  componentName: string,
  data: any,
) => {
  debugLogger.logEditorStore(action, componentId, componentName, data);
};

export const logTenantStore = (
  action: string,
  componentId: string,
  componentName: string,
  data: any,
) => {
  debugLogger.logTenantStore(action, componentId, componentName, data);
};

export const logComponentRender = (
  componentId: string,
  componentName: string,
  componentType: string,
  data: any,
) => {
  debugLogger.logComponentRender(
    componentId,
    componentName,
    componentType,
    data,
  );
};

export const logSidebar = (
  action: string,
  componentId: string,
  componentName: string,
  data: any,
) => {
  debugLogger.logSidebar(action, componentId, componentName, data);
};

export const logUserAction = (
  action: string,
  componentId: string,
  componentName: string,
  data: any,
) => {
  debugLogger.logUserAction(action, componentId, componentName, data);
};

export const clearDebugLog = () => {
  debugLogger.clearLog();
};

export const downloadDebugLog = () => {
  debugLogger.downloadLogs();
};

export const getDebugLogs = () => {
  return debugLogger.getAllLogs();
};

export const getDebugLogsAsString = () => {
  return debugLogger.getLogsAsString();
};

// Export new change logging functions
export const logChange = (
  componentId: string,
  componentName: string,
  componentType: string,
  newData: any,
  changeType: "GLOBAL_HEADER" | "GLOBAL_FOOTER" | "COMPONENT_UPDATE",
) => {
  debugLogger.logChange(
    componentId,
    componentName,
    componentType,
    newData,
    changeType,
  );
};

export const getChangeLogsAsString = () => {
  return debugLogger.getChangeLogsAsString();
};

export const getAllChangeLogs = () => {
  return debugLogger.getAllChangeLogs();
};

export const clearChangeLogs = () => {
  debugLogger.clearChangeLogs();
};
