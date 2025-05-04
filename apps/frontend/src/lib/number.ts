const quantityFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});
export function formatQuantity(quantity: number): string {
  return quantityFormatter.format(quantity);
}
