import { GlobalSettings } from '../types.ts';

export const getCurrencySymbol = (currencyCode?: string, settings?: GlobalSettings): string => {
  const code = (currencyCode || settings?.currency || 'USD').toUpperCase();
  if (settings?.currency?.toUpperCase() === code && settings?.currencySymbol) {
    return settings.currencySymbol;
  }
  switch (code) {
    case 'KES':
      return 'KES ';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'USD':
    default:
      return '$';
  }
};

export const formatMoney = (
  amount: number | undefined | null,
  currencyCode?: string,
  settings?: GlobalSettings
): string => {
  const value = Number(amount ?? 0);
  const symbol = getCurrencySymbol(currencyCode, settings);
  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
