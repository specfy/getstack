/**
 * Calculate tick values for chart axes to reduce overlapping labels.
 * Returns a subset of values based on data length for better mobile display.
 * Used for charts that don't support automatic tick spacing (e.g., ResponsiveAreaBump with string values).
 * For ResponsiveLine with time scales, use automatic tick spacing instead.
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
