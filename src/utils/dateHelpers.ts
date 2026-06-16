/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SummerMonth } from '../types';

export const SUMMER_MONTHS: SummerMonth[] = [
  {
    name: 'Juni 2026',
    year: 2026,
    monthIndex: 5, // June is 5 in JS Date
    daysCount: 30,
    startDayOfWeek: 1, // Monday
  },
  {
    name: 'Juli 2026',
    year: 2026,
    monthIndex: 6, // July is 6 in JS Date
    daysCount: 31,
    startDayOfWeek: 3, // Wednesday
  },
  {
    name: 'August 2026',
    year: 2026,
    monthIndex: 7, // August is 7 in JS Date
    daysCount: 31,
    startDayOfWeek: 6, // Saturday
  },
];

// Generates ISO key "2026-MM-DD" with leading zeros
export function getDateString(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

// Convert "2026-MM-DD" -> "12. juli"
export function formatDateNorwegian(dateStr: string): string {
  if (!dateStr) return '';
  const [, mm, dd] = dateStr.split('-');
  const day = parseInt(dd, 10);
  const monthNum = parseInt(mm, 10);
  
  const monthNames: Record<number, string> = {
    6: 'juni',
    7: 'juli',
    8: 'august',
  };
  
  return `${day}. ${monthNames[monthNum] || mm}`;
}

// Generates complete list of dates for June, July, and August 2026
export function getAllSummerDates(): string[] {
  const dates: string[] = [];
  SUMMER_MONTHS.forEach((m) => {
    for (let d = 1; d <= m.daysCount; d++) {
      dates.push(getDateString(m.year, m.monthIndex, d));
    }
  });
  return dates;
}

// Helper to check if a date is within June, July, or August 2026
export function isValidSummerDate(dateStr: string): boolean {
  return getAllSummerDates().includes(dateStr);
}

// Norwgian week days shorthand start Monday
export const WEEKDAYS_SHORT = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];

// Shift JS getDay() (0=Sun, 1=Mon, ..., 6=Sat) to Norwegian standard (0=Mon, 1=Tue, ..., 6=Sun)
export function getNorwegianDayIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}
