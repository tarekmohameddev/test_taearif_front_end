"use client";

import { create } from "zustand";
import projectsManagement from "./store/projectsManagement";

const useProjectsStore = create((set, get) => ({
  ...projectsManagement(set, get),
}));

export default useProjectsStore;

