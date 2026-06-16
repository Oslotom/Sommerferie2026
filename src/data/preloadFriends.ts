/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Friend, AvailabilityStatus } from '../types';

export const PRELOADED_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    name: 'Ola Nordmann',
    notes: 'Har barna i oddetallsuker. Kan gjerne ta en tur etter kl. 17:00 på hverdager.',
    availability: {
      // June
      '2026-06-05': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-06': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-07': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-12': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-13': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-14': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-15': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-16': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-25': AvailabilityStatus.ON_VACATION,
      '2026-06-26': AvailabilityStatus.ON_VACATION,
      '2026-06-27': AvailabilityStatus.ON_VACATION,
      '2026-06-28': AvailabilityStatus.ON_VACATION,
      // July
      '2026-07-03': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-04': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-10': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-07-11': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-07-12': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-07-17': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-18': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-24': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-07-25': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      // August
      '2026-08-01': AvailabilityStatus.ON_VACATION,
      '2026-08-02': AvailabilityStatus.ON_VACATION,
      '2026-08-03': AvailabilityStatus.ON_VACATION,
      '2026-08-14': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-15': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-16': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-21': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-08-22': AvailabilityStatus.AVAILABLE_WITH_KIDS,
    },
  },
  {
    id: 'friend-2',
    name: 'Kari Hegg',
    notes: 'Samboer jobber turnus. Jobber selv deltid i juli.',
    availability: {
      // June
      '2026-06-12': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-13': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-14': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-16': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-17': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-18': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-20': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-21': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      // July
      '2026-07-10': AvailabilityStatus.ON_VACATION,
      '2026-07-11': AvailabilityStatus.ON_VACATION,
      '2026-07-12': AvailabilityStatus.ON_VACATION,
      '2026-07-13': AvailabilityStatus.ON_VACATION,
      '2026-07-14': AvailabilityStatus.ON_VACATION,
      '2026-07-15': AvailabilityStatus.ON_VACATION,
      '2026-07-25': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-26': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      // August
      '2026-08-14': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-15': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-08-22': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-25': AvailabilityStatus.AVAILABLE_WITH_KIDS,
    },
  },
  {
    id: 'friend-3',
    name: 'Jonas Dahl',
    notes: 'Alltid klar for grilling og båtkjøring. Ingen barna - alltid🍻!',
    availability: {
      // June
      '2026-06-05': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-06': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-12': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-13': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-14': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-16': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-20': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-27': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      // July
      '2026-07-04': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-10': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-11': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-12': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-18': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-25': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-26': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      // August
      '2026-08-08': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-09': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-14': AvailabilityStatus.ON_VACATION,
      '2026-08-15': AvailabilityStatus.ON_VACATION,
      '2026-08-16': AvailabilityStatus.ON_VACATION,
      '2026-08-21': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-08-22': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
    },
  },
  {
    id: 'friend-4',
    name: 'Astrid Lind',
    notes: 'Alenemor med barna i partallsuker. Elsker strandturer.',
    availability: {
      // June
      '2026-06-06': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-07': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-12': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-13': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-14': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-06-20': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-06-21': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      // July
      '2026-07-01': AvailabilityStatus.ON_VACATION,
      '2026-07-02': AvailabilityStatus.ON_VACATION,
      '2026-07-03': AvailabilityStatus.ON_VACATION,
      '2026-07-04': AvailabilityStatus.ON_VACATION,
      '2026-07-11': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-07-12': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-07-18': AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      '2026-07-25': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      // August
      '2026-08-14': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-08-15': AvailabilityStatus.AVAILABLE_WITH_KIDS,
      '2026-08-22': AvailabilityStatus.AVAILABLE_WITH_KIDS,
    },
  },
];
