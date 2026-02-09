import { useState, useEffect } from "react";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { fetchProject, getMockProject } from "../services";
import type { Project } from "../types";

export const useProject = (projectSlug: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const { tenantId: hookTenantId, isLoading: tenantLoading } = useTenantId();
  const tenantId = useTenantStore((s) => s.tenantId);

  // Check if we're in Live Editor
  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  // Fetch project data
  const loadProject = async () => {
    // Use mock data in Live Editor
    if (isLiveEditor) {
      const mockProject = getMockProject();
      setProject(mockProject);
      setLoadingProject(false);
      return;
    }

    try {
      setLoadingProject(true);
      setProjectError(null);

      const finalTenantId = hookTenantId || tenantId;
      if (!finalTenantId) {
        setLoadingProject(false);
        return;
      }

      const projectData = await fetchProject(finalTenantId, projectSlug);
      setProject(projectData);
    } catch (error) {
      console.error("ProjectDetails2: Error fetching project:", error);
      setProjectError("حدث خطأ في تحميل بيانات المشروع");
    } finally {
      setLoadingProject(false);
    }
  };

  // Fetch project on mount and when dependencies change
  useEffect(() => {
    if (isLiveEditor) {
      loadProject();
      return;
    }

    const finalTenantId = hookTenantId || tenantId;
    if (finalTenantId && projectSlug) {
      loadProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hookTenantId, tenantId, projectSlug, isLiveEditor]);

  return {
    project,
    loadingProject,
    projectError,
    tenantLoading,
    refetch: loadProject,
  };
};
