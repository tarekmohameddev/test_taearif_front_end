import { useState, useEffect } from "react";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { Project } from "../types";
import { fetchSimilarProjects } from "../services/projectApi";
import { mockProject, getMockSimilarProjects } from "../utils/mockData";

/**
 * Hook to fetch and manage similar projects
 */
export const useSimilarProjects = (
  enabled: boolean,
  limit: number,
  isLiveEditor: boolean,
) => {
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const { tenantId: hookTenantId } = useTenantId();
  const tenantId = useTenantStore((s) => s.tenantId);

  const loadSimilarProjects = async () => {
    // Use mock data in Live Editor
    if (isLiveEditor) {
      const mockSimilarProjects = getMockSimilarProjects(mockProject);
      setSimilarProjects(mockSimilarProjects);
      setLoadingSimilar(false);
      return;
    }

    try {
      setLoadingSimilar(true);

      const finalTenantId = hookTenantId || tenantId;
      if (!finalTenantId) {
        setLoadingSimilar(false);
        return;
      }

      const projects = await fetchSimilarProjects(finalTenantId, limit);
      setSimilarProjects(projects);
    } catch (error) {
      console.error("Error fetching similar projects:", error);
      setSimilarProjects([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setLoadingSimilar(false);
      return;
    }

    if (isLiveEditor) {
      loadSimilarProjects();
      return;
    }

    const finalTenantId = hookTenantId || tenantId;
    if (finalTenantId) {
      loadSimilarProjects();
    }
  }, [hookTenantId, tenantId, enabled, limit, isLiveEditor]);

  return {
    similarProjects,
    loadingSimilar,
  };
};
