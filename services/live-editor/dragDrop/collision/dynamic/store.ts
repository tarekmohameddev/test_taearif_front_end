import { createStore } from "zustand";

/**
 * Store لإدارة حالة نظام collision detection
 */
export interface CollisionStore {
  fallbackEnabled: boolean;
  debugMode: boolean;
  sensitivity: number;
  lastCollisionId: string | null;
  collisionHistory: Array<{
    id: string;
    timestamp: number;
    type: string;
  }>;
}

export const collisionStore = createStore<CollisionStore>(() => ({
  fallbackEnabled: true,
  debugMode: process.env.NODE_ENV === "development",
  sensitivity: 0.05, // 5% من حجم العنصر
  lastCollisionId: null,
  collisionHistory: [],
}));

/**
 * تسجيل collision جديد في التاريخ
 */
export const recordCollision = (id: string, type: string) => {
  const state = collisionStore.getState();
  const newEntry = {
    id,
    timestamp: Date.now(),
    type,
  };

  // الاحتفاظ بآخر 50 collision فقط
  const updatedHistory = [newEntry, ...state.collisionHistory].slice(0, 50);

  collisionStore.setState({
    lastCollisionId: id,
    collisionHistory: updatedHistory,
  });
};

/**
 * تنظيف تاريخ الcollisions القديمة
 */
export const cleanupCollisionHistory = (maxAge: number = 5000) => {
  const state = collisionStore.getState();
  const now = Date.now();

  const filteredHistory = state.collisionHistory.filter(
    (entry) => now - entry.timestamp < maxAge,
  );

  collisionStore.setState({
    collisionHistory: filteredHistory,
  });
};
