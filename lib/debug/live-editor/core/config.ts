/**
 * Configuration for AI-Friendly Debugger System
 * Centralized configuration management
 */

import path from "path";
import { DebugConfig, LoggingLevel } from "./types";

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Default configuration
 */
const defaultConfig: DebugConfig = {
  enabled: false,
  maxEvents: 1000,
  maxTraces: 100,
  logsDir: path.join(process.cwd(), "debug", "logs"),
  loggingLevel: "info",
  sessionId: generateSessionId(),
};

/**
 * Current configuration
 */
let currentConfig: DebugConfig = { ...defaultConfig };

/**
 * Get current configuration
 */
export function getConfig(): DebugConfig {
  return { ...currentConfig };
}

/**
 * Update configuration
 */
export function updateConfig(updates: Partial<DebugConfig>): void {
  currentConfig = {
    ...currentConfig,
    ...updates,
  };
}

/**
 * Enable debug mode
 */
export function enableDebug(): void {
  currentConfig.enabled = true;
  currentConfig.sessionId = generateSessionId();
}

/**
 * Disable debug mode
 */
export function disableDebug(): void {
  currentConfig.enabled = false;
}

/**
 * Check if debug is enabled
 */
export function isDebugEnabled(): boolean {
  return currentConfig.enabled && process.env.NODE_ENV === "development";
}

/**
 * Get session ID
 */
export function getSessionId(): string {
  return currentConfig.sessionId;
}

/**
 * Get logs directory
 */
export function getLogsDir(): string {
  return currentConfig.logsDir;
}

/**
 * Get max events limit
 */
export function getMaxEvents(): number {
  return currentConfig.maxEvents;
}

/**
 * Get max traces limit
 */
export function getMaxTraces(): number {
  return currentConfig.maxTraces;
}

/**
 * Get logging level
 */
export function getLoggingLevel(): LoggingLevel {
  return currentConfig.loggingLevel;
}

/**
 * Set logging level
 */
export function setLoggingLevel(level: LoggingLevel): void {
  currentConfig.loggingLevel = level;
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): void {
  currentConfig = { ...defaultConfig };
}
