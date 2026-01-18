/**
 * Create a format function for chart axes to reduce overlapping labels.
 * Returns a function that conditionally shows labels based on data length for better mobile display.
 * @param values - Array of values (e.g., dates, week strings)
 * @returns Format function that returns the value or empty string
 */
export function createTickFormatter<T>(values: T[]): (value: T) => string {
  if (values.length === 0) return () => '';

  const dataLength = values.length;
  // Show fewer ticks: more aggressive reduction for better mobile display
  const step = dataLength > 20 ? 4 : dataLength > 12 ? 3 : dataLength > 6 ? 2 : 1;

  const visibleIndices = new Set(
    values
      .map((_, index) => index)
      .filter((index) => index % step === 0 || index === dataLength - 1)
  );

  return (value: T) => {
    const index = values.indexOf(value);
    return visibleIndices.has(index) ? String(value) : '';
  };
}

/**
 * Calculate tick values for chart axes to reduce overlapping labels.
 * Returns a subset of values based on data length for better mobile display.
 * @param values - Array of values to filter (e.g., dates, week strings)
 * @returns Filtered array of values to display as ticks
 */
export function calculateTickValues<T>(values: T[]): T[] {
  if (values.length === 0) return [];

  const dataLength = values.length;
  // Show fewer ticks: more aggressive reduction for better mobile display
  const step = dataLength > 20 ? 4 : dataLength > 12 ? 3 : dataLength > 6 ? 2 : 1;

  return values.filter(
    (_, index) => index % step === 0 || index === dataLength - 1
  );
}
