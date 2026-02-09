import { useState, useEffect } from "react";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";
import { Project } from "../types";
import { fetchProject } from "../services/projectApi";
import { mockProject } from "../utils/mockData";

/**
 * Hook to fetch and manage project data
 */
export const useProjectData = (
  projectSlug: string,
  isLiveEditor: boolean,
) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  const { tenantId: hookTenantId, isLoading: tenantLoading } = useTenantId();
  const tenantId = useTenantStore((s) => s.tenantId);

  const loadProject = async () => {
    // Use mock data in Live Editor
    if (isLiveEditor) {
      setProject(mockProject);
      setLoadingProject(false);
      setMainImage(mockProject.image || "");
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

      if (!projectSlug) {
        setLoadingProject(false);
        return;
      }

      const projectData = await fetchProject(finalTenantId, projectSlug);
      setProject(projectData);
      setMainImage(projectData.image || "");
    } catch (error) {
      console.error("ProjectDetails: Error fetching project:", error);
      setProjectError("حدث خطأ في تحميل بيانات المشروع");
    } finally {
      setLoadingProject(false);
    }
  };

  useEffect(() => {
    if (isLiveEditor) {
      loadProject();
      return;
    }

    const finalTenantId = hookTenantId || tenantId;
    if (finalTenantId && projectSlug) {
      loadProject();
    }
  }, [hookTenantId, tenantId, projectSlug, isLiveEditor]);

  return {
    project,
    loadingProject,
    projectError,
    mainImage,
    setMainImage,
    tenantLoading,
    refetch: loadProject,
  };
};
