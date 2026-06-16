/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AvailabilityStatus {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  AVAILABLE_WITHOUT_KIDS = 'AVAILABLE_WITHOUT_KIDS',
  AVAILABLE_WITH_KIDS = 'AVAILABLE_WITH_KIDS',
  ON_VACATION = 'ON_VACATION',
}

export interface Friend {
  id: string;
  name: string;
  notes: string;
  availability: Record<string, AvailabilityStatus>; // Key: "YYYY-MM-DD", Value: Status
}

export type FilterType = 'ALL' | 'NO_KIDS' | 'WITH_KIDS' | 'VACATION';

export interface SummerMonth {
  name: string;
  year: number;
  monthIndex: number; // 5 = June, 6 = July, 7 = August (0-indexed)
  daysCount: number;
  startDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc. In Norway, Monday is start.
}
