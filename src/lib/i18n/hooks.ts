/**
 * React hooks for internationalization
 */

import { useCallback, useMemo } from 'react';
import { 
  formatCurrency, 
  formatDate, 
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDistance,
  formatNumber,
  formatPercent,
  getTextDirection
} from './formatters';

// Mock hook for demonstration - replace with actual implementation
function useLocale(): string {
  // This would typically come from your i18n library (next-intl, react-i18next, etc.)
  return typeof window !== 'undefined' 
    ? window.navigator.language || 'en' 
    : 'en';
}

/**
 * Hook for accessing all formatting functions with current locale
 */
export function useFormatters() {
  const locale = useLocale();
  
  return useMemo(() => ({
    currency: (amount: number) => formatCurrency(amount, locale),
    number: (num: number) => formatNumber(num, locale),
    percent: (num: number) => formatPercent(num, locale),
    date: (date: Date | string, options?: Intl.DateTimeFormatOptions) => 
      formatDate(date, locale, options),
    time: (date: Date | string, use24Hour?: boolean) => 
      formatTime(date, locale, use24Hour),
    dateTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => 
      formatDateTime(date, locale, options),
    relativeTime: (date: Date | string, baseDate?: Date) => 
      formatRelativeTime(date, locale, baseDate),
    distance: (meters: number, imperial?: boolean) => 
      formatDistance(meters, locale, imperial),
  }), [locale]);
}

/**
 * Hook for direction-aware CSS classes
 */
export function useDirection() {
  const locale = useLocale();
  const dir = getTextDirection(locale);
  const isRTL = dir === 'rtl';
  
  return useMemo(() => ({
    dir,
    isRTL,
    isLTR: !isRTL,
    
    // Margin utilities
    ms: (value: string | number) => isRTL ? `mr-${value}` : `ml-${value}`,
    me: (value: string | number) => isRTL ? `ml-${value}` : `mr-${value}`,
    mx: (value: string | number) => `mx-${value}`,
    my: (value: string | number) => `my-${value}`,
    
    // Padding utilities
    ps: (value: string | number) => isRTL ? `pr-${value}` : `pl-${value}`,
    pe: (value: string | number) => isRTL ? `pl-${value}` : `pr-${value}`,
    px: (value: string | number) => `px-${value}`,
    py: (value: string | number) => `py-${value}`,
    
    // Position utilities
    start: (value: string | number) => isRTL ? `right-${value}` : `left-${value}`,
    end: (value: string | number) => isRTL ? `left-${value}` : `right-${value}`,
    
    // Text alignment
    textStart: isRTL ? 'text-right' : 'text-left',
    textEnd: isRTL ? 'text-left' : 'text-right',
    textCenter: 'text-center',
    
    // Flex utilities
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    flexRowReverse: isRTL ? 'flex-row' : 'flex-row-reverse',
    
    // Border radius
    roundedStart: (value: string) => isRTL ? `rounded-r-${value}` : `rounded-l-${value}`,
    roundedEnd: (value: string) => isRTL ? `rounded-l-${value}` : `rounded-r-${value}`,
    
    // Transform
    scaleX: isRTL ? '-1' : '1',
    
    // Logical properties for custom styles
    insetStart: isRTL ? 'right' : 'left',
    insetEnd: isRTL ? 'left' : 'right',
  }), [isRTL]);
}

/**
 * Hook for locale-aware pluralization
 */
export function usePluralize() {
  const locale = useLocale();
  
  return useCallback((count: number, singular: string, plural: string) => {
    // This is a simplified version. Real implementation would use
    // Intl.PluralRules for proper pluralization rules per locale
    const pr = new Intl.PluralRules(locale);
    const rule = pr.select(count);
    
    // For now, simple singular/plural
    return count === 1 ? singular : plural;
  }, [locale]);
}

/**
 * Hook for managing locale preferences
 */
export function useLocalePreference() {
  const currentLocale = useLocale();
  
  const setLocale = useCallback((newLocale: string) => {
    // Store in localStorage
    localStorage.setItem('preferred-locale', newLocale);
    
    // Trigger locale change in your i18n library
    // This is implementation-specific
    
    // For demonstration, reload the page
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const pathSegments = url.pathname.split('/');
      
      // Assume first segment is locale
      if (pathSegments[1] && pathSegments[1].length === 2) {
        pathSegments[1] = newLocale;
      } else {
        pathSegments.splice(1, 0, newLocale);
      }
      
      url.pathname = pathSegments.join('/');
      window.location.href = url.toString();
    }
  }, []);
  
  const getStoredLocale = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('preferred-locale') || null;
    }
    return null;
  }, []);
  
  return {
    locale: currentLocale,
    setLocale,
    storedLocale: getStoredLocale(),
  };
}

/**
 * Hook for locale-specific configuration
 */
export function useLocaleConfig() {
  const locale = useLocale();
  
  return useMemo(() => {
    const baseLocale = locale.split('-')[0];
    
    return {
      // Date picker configuration
      firstDayOfWeek: ['en', 'ja', 'zh'].includes(baseLocale) ? 0 : 1, // Sunday vs Monday
      
      // Number formatting
      decimalSeparator: ['en'].includes(baseLocale) ? '.' : ',',
      thousandSeparator: ['en'].includes(baseLocale) ? ',' : '.',
      
      // Currency position
      currencyBeforeAmount: !['fr', 'de'].includes(baseLocale),
      
      // Time format
      use24HourTime: !['en'].includes(baseLocale),
      
      // Distance units
      useImperialUnits: locale.startsWith('en-US'),
      
      // Phone format
      phoneCountryCode: getPhoneCountryCode(locale),
    };
  }, [locale]);
}

// Helper function to get phone country code
function getPhoneCountryCode(locale: string): string {
  const countryMap: Record<string, string> = {
    'en-US': 'US',
    'en-GB': 'GB',
    'es-ES': 'ES',
    'es-MX': 'MX',
    'fr-FR': 'FR',
    'de-DE': 'DE',
    'it-IT': 'IT',
    'pt-BR': 'BR',
    'ar-AE': 'AE',
    'zh-CN': 'CN',
    'ja-JP': 'JP',
  };
  
  return countryMap[locale] || 'US';
}