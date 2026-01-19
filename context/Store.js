// context/Store.js
import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

// Import store modules
import dashboardDevice from "./store/homepage/dashboardDevice";
import dashboardSummary from "./store/homepage/dashboardSummary";
import visitorData from "./store/homepage/visitorData";
import setupProgress from "./store/homepage/setupProgress";
import trafficSources from "./store/homepage/trafficSources";
import contentManagement from "./store/contentManagement";
import recentActivity from "./store/recentActivity";
import projectsManagement from "./store/projectsManagement";
import propertiesManagement from "./store/propertiesManagement";
import incompletePropertiesManagement from "./store/incompletePropertiesManagement";
import blogManagement from "./store/blogManagement";
import affiliate from "./store/affiliate";
import sidebar from "./store/sidebar";
import rentalManagement from "./store/rentalManagement";
import purchaseManagement from "./store/purchaseManagement";
import matchingPage from "./store/matchingPage";
import marketingDashboard from "./store/marketingDashboard";
import rentalOwnerDashboardPage from "./store/rentalOwnerDashboardPage";
import userAuth from "./store/userAuth";

const useStore = create((set, get) => {
  return {
    loading: false,
    homepage: {
      ...dashboardDevice(set),
      ...dashboardSummary(set),
      ...visitorData(set),
      ...setupProgress(set),
      ...trafficSources(set),

      setSelectedTimeRange: (range) =>
        set((state) => ({
          homepage: { ...state.homepage, selectedTimeRange: range },
        })),
    },
    ...contentManagement(set),
    ...recentActivity(set),
    ...projectsManagement(set),
    ...propertiesManagement(set),
    ...incompletePropertiesManagement(set),
    ...blogManagement(set, get),
    ...affiliate(set, get),
    ...sidebar(set, get),
    ...rentalManagement(set, get),
    ...purchaseManagement(set, get),
    ...matchingPage(set, get),
    ...marketingDashboard(set, get),
    ...rentalOwnerDashboardPage(set, get),
    ...userAuth(set),
  };
});

export default useStore;
