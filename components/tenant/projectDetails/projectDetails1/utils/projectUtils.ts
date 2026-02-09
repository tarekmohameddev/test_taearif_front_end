/**
 * Convert completeStatus from number to readable text
 * @param status - The status number or string
 * @returns The readable status text
 */
export const getCompleteStatusText = (
  status: number | string | undefined | null,
): string => {
  if (status === undefined || status === null) return "قيد الإنشاء";
  const statusNum = typeof status === "string" ? parseInt(status, 10) : status;
  switch (statusNum) {
    case 0:
      return "قيد الإنشاء";
    case 1:
      return "منتهي";
    case 2:
      return "لم ينشأ بعد";
    default:
      return "قيد الإنشاء";
  }
};

/**
 * Get current URL
 * @returns The current URL string
 */
export const getCurrentUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
};

/**
 * Get share text for a project
 * @param project - The project object
 * @returns The share text string
 */
export const getShareText = (project: { title: string; address?: string; district?: string } | null): string => {
  if (!project) return "";
  return `شاهد هذا المشروع العقاري الرائع: ${project.title} - ${project.address || project.district}`;
};
