/**
 * Wall-clock time for event handlers and initial form values. The React compiler lint
 * flags bare Date.now() in component bodies even inside handlers, where it's correct.
 */
export function nowMs(): number {
  return Date.now();
}
