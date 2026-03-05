/**
 * Format datetime string for display (ar-SA, short).
 * Returns "—" for empty/invalid input.
 */
export function formatAppointmentDatetime(datetime: string | undefined): string {
  if (!datetime) return "—";
  try {
    const d = new Date(datetime);
    return d.toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return datetime;
  }
}
