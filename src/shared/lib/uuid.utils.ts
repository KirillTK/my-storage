const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function extractLastUuid(slug: string[]): string | null {
  // Iterate backwards to find the last UUID
  for (let i = slug.length - 1; i >= 0; i--) {
    const segment = slug[i];
    if (segment && UUID_REGEX.test(segment)) {
      return segment;
    }
  }
  return null;
}
