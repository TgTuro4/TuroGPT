/**
 * Generate a unique ID for use as message identifiers
 * Simple implementation that doesn't require external dependencies
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};
