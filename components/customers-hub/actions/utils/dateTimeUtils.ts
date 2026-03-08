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

/** Stitch-style: "YYYY/MM/DD • HH:MM AM" for next-action block */
export function formatNextActionDatetime(datetime: string | undefined): string {
  if (!datetime) return "—";
  try {
    const d = new Date(datetime);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${y}/${m}/${day} • ${h12}:${min} ${ampm}`;
  } catch {
    return datetime;
  }
}
