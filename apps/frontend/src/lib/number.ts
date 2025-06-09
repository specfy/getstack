const quantityFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatQuantity(quantity: number): string {
  return quantityFormatter.format(quantity);
}

const fileSizeFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatSize(kb: number): string {
  if (kb === 0) {
    return '0Kb';
  }

  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  const exponent = Math.min(Math.floor(Math.log(kb) / Math.log(1024)), units.length - 1);
  const size = kb / Math.pow(1024, exponent);

  return `${fileSizeFormatter.format(size)} ${units[exponent]}`;
}
