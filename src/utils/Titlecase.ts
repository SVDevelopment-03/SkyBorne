/**
 * Converts a string to Title Case
 * @param str - input string
 * @returns string in Title Case
 */
export function toTitleCase(str?: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
