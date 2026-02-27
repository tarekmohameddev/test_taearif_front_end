/** Build list of page numbers + ellipsis for pagination (e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 12]) */
export function getPaginationPages(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const set = new Set<number>([1, totalPages]);
  set.add(currentPage);
  if (currentPage > 1) set.add(currentPage - 1);
  if (currentPage < totalPages) set.add(currentPage + 1);
  const sorted = Array.from(set).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) result.push("ellipsis");
    result.push(sorted[i]!);
  }
  return result;
}
