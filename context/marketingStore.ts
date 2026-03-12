"use client";

import { create } from "zustand";
import marketingDashboard from "./store/marketingDashboard";

// Lightweight store that exposes only marketing-related state/actions
// (marketingChannels, creditPackages, creditAnalytics, etc.).
// This avoids pulling the full combined Store.js bundle when we only
// need marketing features like WhatsApp channels.
const useMarketingStore = create((set, get) => ({
  ...marketingDashboard(set, get),
}));

export default useMarketingStore;

