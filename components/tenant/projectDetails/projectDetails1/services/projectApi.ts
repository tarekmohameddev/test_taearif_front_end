import axiosInstance from "@/lib/axiosInstance";
import { Project } from "../types";

/**
 * Fetch project by slug
 * @param tenantId - The tenant ID
 * @param projectSlug - The project slug
 * @returns The project data
 */
export const fetchProject = async (
  tenantId: string,
  projectSlug: string,
): Promise<Project> => {
  const response = await axiosInstance.get(
    `/v1/tenant-website/${tenantId}/projects/${projectSlug}`,
  );

  if (response.data && response.data.project) {
    return response.data.project;
  } else if (response.data) {
    return response.data;
  } else {
    throw new Error("المشروع غير موجود");
  }
};

/**
 * Fetch similar projects
 * @param tenantId - The tenant ID
 * @param limit - The limit of projects to fetch
 * @returns Array of similar projects
 */
export const fetchSimilarProjects = async (
  tenantId: string,
  limit: number = 10,
): Promise<Project[]> => {
  const response = await axiosInstance.get(
    `/v1/tenant-website/${tenantId}/projects?latest=1&limit=${limit}`,
  );

  if (response.data && response.data.projects) {
    return response.data.projects;
  } else if (response.data && Array.isArray(response.data)) {
    return response.data;
  } else {
    return [];
  }
};
