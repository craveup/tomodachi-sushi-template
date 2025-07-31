/**
 * Internationalization formatters for restaurant ordering system
 */

// Currency mapping by locale
const currencyMap: Record<string, string> = {
  'en': 'USD',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'es': 'EUR',
  'es-MX': 'MXN',
  'fr': 'EUR',
  'ar': 'AED',
  'zh': 'CNY',
  'ja': 'JPY',
  'de': 'EUR',
  'it': 'EUR',
  'pt': 'EUR',
  'pt-BR': 'BRL',
};

// Get currency for a given locale
export function getCurrencyForLocale(locale: string): string {
  return currencyMap[locale] || currencyMap[locale.split('-')[0]] || 'USD';
}

// Format currency with locale-specific formatting
export function formatCurrency(amount: number, locale: string): string {
  const currency = getCurrencyForLocale(locale);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with locale-specific formatting
export function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(num);
}

// Format percentage
export function formatPercent(num: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num / 100);
}

// Format date with various styles
export function formatDate(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

// Format time
export function formatTime(
  date: Date | string,
  locale: string,
  use24Hour?: boolean
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Determine if locale typically uses 24-hour format
  const is24HourLocale = ['fr', 'de', 'it', 'es', 'pt'].includes(locale.split('-')[0]);
  const hour12 = use24Hour !== undefined ? !use24Hour : !is24HourLocale;
  
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12,
  }).format(dateObj);
}

// Format date and time together
export function formatDateTime(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

// Format relative time (e.g., "5 minutes ago", "in 2 hours")
export function formatRelativeTime(
  date: Date | string,
  locale: string,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = (dateObj.getTime() - baseDate.getTime()) / 1000;
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  // Determine the appropriate unit
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];
  
  for (const [unit, secondsInUnit] of units) {
    const diff = Math.round(diffInSeconds / secondsInUnit);
    if (Math.abs(diff) >= 1) {
      return rtf.format(diff, unit);
    }
  }
  
  return rtf.format(0, 'second');
}

// Format restaurant operating hours
export function formatOperatingHours(
  openTime: string,
  closeTime: string,
  locale: string
): string {
  const open = formatTime(`2024-01-01T${openTime}`, locale);
  const close = formatTime(`2024-01-01T${closeTime}`, locale);
  
  return `${open} - ${close}`;
}

// Format distance with appropriate units
export function formatDistance(
  distanceInMeters: number,
  locale: string,
  imperial: boolean = locale.startsWith('en-US')
): string {
  if (imperial) {
    const miles = distanceInMeters / 1609.34;
    if (miles < 0.1) {
      const feet = Math.round(distanceInMeters * 3.28084);
      return `${formatNumber(feet, locale)} ft`;
    }
    return `${formatNumber(Number(miles.toFixed(1)), locale)} mi`;
  } else {
    if (distanceInMeters < 1000) {
      return `${formatNumber(Math.round(distanceInMeters), locale)} m`;
    }
    const km = distanceInMeters / 1000;
    return `${formatNumber(Number(km.toFixed(1)), locale)} km`;
  }
}

// Format phone numbers
export function formatPhoneNumber(
  phone: string,
  locale: string,
  countryCode: string = 'US'
): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on country
  switch (countryCode) {
    case 'US':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      break;
    case 'UK':
      if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
      }
      break;
    // Add more country-specific formatting as needed
  }
  
  return phone; // Return original if no formatting rule applies
}

// Get text direction for locale
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale.split('-')[0]) ? 'rtl' : 'ltr';
}

// Format file size
export function formatFileSize(bytes: number, locale: string): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${formatNumber(Number(size.toFixed(1)), locale)} ${units[unitIndex]}`;
}