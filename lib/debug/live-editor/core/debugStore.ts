/**
 * Zustand Store for Debug Data
 * Runtime-only store for debug information
 */

"use client";

import { create } from "zustand";
import { AIFriendlyEvent, ComponentTrace, StoreSnapshot, DataFlowStep, DetailedPerformanceMetrics } from "./types";
import { getConfig, isDebugEnabled, getSessionId } from "./config";

interface DebugStoreState {
  // Events array (max 1000 in memory)
  events: AIFriendlyEvent[];
  
  // Component traces Map
  componentTraces: Map<string, ComponentTrace>;
  
  // Store snapshots array
  storeSnapshots: StoreSnapshot[];
  
  // Data flow history
  dataFlowHistory: DataFlowStep[];
  
  // Performance metrics
  performanceMetrics: DetailedPerformanceMetrics[];
  
  // Cache state
  cacheState: Map<string, any>;
  
  // Enabled flag
  enabled: boolean;
  
  // Actions
  addEvent: (event: AIFriendlyEvent) => void;
  addTrace: (trace: ComponentTrace) => void;
  addSnapshot: (snapshot: StoreSnapshot) => void;
  addDataFlow: (dataFlow: DataFlowStep) => void;
  addPerformance: (performance: DetailedPerformanceMetrics) => void;
  updateCache: (key: string, value: any) => void;
  getCache: (key: string) => any;
  clearAllData: () => void;
  enableDebug: () => void;
  disableDebug: () => void;
}

export const useDebugStore = create<DebugStoreState>((set, get) => ({
  // Initial state
  events: [],
  componentTraces: new Map(),
  storeSnapshots: [],
  dataFlowHistory: [],
  performanceMetrics: [],
  cacheState: new Map(),
  enabled: isDebugEnabled(),

  // Add event
  addEvent: (event: AIFriendlyEvent) => {
    if (!get().enabled) return;

    set((state) => {
      const newEvents = [...state.events, event];
      // Limit to max events
      const maxEvents = getConfig().maxEvents;
      const limitedEvents = newEvents.slice(-maxEvents);
      
      return {
        events: limitedEvents,
      };
    });
  },

  // Add trace
  addTrace: (trace: ComponentTrace) => {
    if (!get().enabled) return;

    set((state) => {
      const newTraces = new Map(state.componentTraces);
      newTraces.set(trace.componentId, trace);
      
      // Limit traces
      const maxTraces = getConfig().maxTraces;
      if (newTraces.size > maxTraces) {
        // Remove oldest trace
        const firstKey = newTraces.keys().next().value;
        newTraces.delete(firstKey);
      }
      
      return {
        componentTraces: newTraces,
      };
    });
  },

  // Add snapshot
  addSnapshot: (snapshot: StoreSnapshot) => {
    if (!get().enabled) return;

    set((state) => {
      const newSnapshots = [...state.storeSnapshots, snapshot];
      // Limit snapshots (keep last 500)
      const limitedSnapshots = newSnapshots.slice(-500);
      
      return {
        storeSnapshots: limitedSnapshots,
      };
    });
  },

  // Add data flow
  addDataFlow: (dataFlow: DataFlowStep) => {
    if (!get().enabled) return;

    set((state) => {
      const newDataFlow = [...state.dataFlowHistory, dataFlow];
      // Limit data flow history (keep last 1000)
      const limitedDataFlow = newDataFlow.slice(-1000);
      
      return {
        dataFlowHistory: limitedDataFlow,
      };
    });
  },

  // Add performance metrics
  addPerformance: (performance: DetailedPerformanceMetrics) => {
    if (!get().enabled) return;

    set((state) => {
      const newPerformance = [...state.performanceMetrics, performance];
      // Limit performance metrics (keep last 500)
      const limitedPerformance = newPerformance.slice(-500);
      
      return {
        performanceMetrics: limitedPerformance,
      };
    });
  },

  // Update cache
  updateCache: (key: string, value: any) => {
    if (!get().enabled) return;

    set((state) => {
      const newCache = new Map(state.cacheState);
      newCache.set(key, value);
      
      return {
        cacheState: newCache,
      };
    });
  },

  // Get cache
  getCache: (key: string) => {
    return get().cacheState.get(key);
  },

  // Clear all data
  clearAllData: () => {
    set({
      events: [],
      componentTraces: new Map(),
      storeSnapshots: [],
      dataFlowHistory: [],
      performanceMetrics: [],
      cacheState: new Map(),
    });
  },

  // Enable debug
  enableDebug: () => {
    // Clear all data first
    get().clearAllData();
    
    set({
      enabled: true,
    });
  },

  // Disable debug
  disableDebug: () => {
    set({
      enabled: false,
    });
  },
}));
