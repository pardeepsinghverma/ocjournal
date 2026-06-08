const CURRENCY_SYMBOLS = {
  INR: '₹',
  SAR: 'SAR ',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const DEFAULT_CURRENCY = 'INR';

const extractNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const match = String(value).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const formatNumber = (value) => {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

export const formatPrice = (value, currency = DEFAULT_CURRENCY) => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '';
  const amount = extractNumber(value);
  return `${symbol}${formatNumber(amount)}`;
};

export const parsePrice = extractNumber;
