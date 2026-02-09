// Helper function to convert completeStatus from number to readable text
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
