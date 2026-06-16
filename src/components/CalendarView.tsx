/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Friend, AvailabilityStatus } from '../types';
import { SUMMER_MONTHS, WEEKDAYS_SHORT, getDateString } from '../utils/dateHelpers';

interface CalendarViewProps {
  friends: Friend[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  friends,
  selectedDate,
  onSelectDate,
}) => {
  // Hardcode current date as June 16, 2026, matching local simulated time
  const TODAY_STR = '2026-06-16';

  const getDayAvailabilityStates = (dateStr: string) => {
    let withoutKids = 0;
    let withKids = 0;
    let vacation = 0;

    friends.forEach((f) => {
      const status = f.availability[dateStr];
      if (status === AvailabilityStatus.AVAILABLE_WITHOUT_KIDS) {
        withoutKids++;
      } else if (status === AvailabilityStatus.AVAILABLE_WITH_KIDS) {
        withKids++;
      } else if (status === AvailabilityStatus.ON_VACATION) {
        vacation++;
      }
    });

    return { withoutKids, withKids, vacation, totalAvailable: withoutKids + withKids + vacation };
  };

  return (
    <div className="space-y-6">
      {SUMMER_MONTHS.map((m) => {
        const offset = m.startDayOfWeek === 0 ? 6 : m.startDayOfWeek - 1;
        const blanks = Array(offset).fill(null);
        
        const days = [];
        for (let d = 1; d <= m.daysCount; d++) {
          days.push(d);
        }

        return (
          <div key={m.name} className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2.5 flex items-center justify-between">
              <span>{m.name}</span>
              <span className="text-[11px] font-normal text-zinc-500">2026</span>
            </h3>

            {/* Weekdays Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {WEEKDAYS_SHORT.map((dayLabel) => (
                <span key={dayLabel} className="text-[10px] font-bold text-zinc-500 py-1 uppercase tracking-wider">
                  {dayLabel}
                </span>
              ))}
            </div>

            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-1.5">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square opacity-0 pointer-events-none" />
              ))}

              {days.map((day) => {
                const dateStr = getDateString(m.year, m.monthIndex, day);
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === TODAY_STR;
                
                const { withoutKids, withKids, vacation, totalAvailable } = getDayAvailabilityStates(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => onSelectDate(dateStr)}
                    className={`
                      aspect-square relative flex flex-col items-center justify-between py-1.5 rounded-xl
                      transition-all duration-150 border cursor-pointer active:scale-95 text-xs font-semibold
                      ${isSelected 
                        ? 'bg-orange-500 border-orange-500 text-black scale-102 shadow-md shadow-orange-500/20 ring-4 ring-orange-500/20' 
                        : isToday
                          ? 'bg-[#141414] border-orange-500/60 text-orange-400 hover:bg-[#1A1A1A]'
                          : 'bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#222] hover:border-[#333] text-zinc-200'
                      }
                    `}
                  >
                    {/* Top status indicator or today label */}
                    <span className="text-[9px] text-zinc-500 font-bold leading-none pointer-events-none">
                      {isToday && !isSelected && 'Idag'}
                    </span>

                    {/* Day Number */}
                    <span className={`text-sm ${isSelected ? 'font-black' : 'font-semibold'} leading-none mt-0.5`}>
                      {day}
                    </span>

                    {/* Quick activity dots */}
                    <div className="flex gap-0.5 justify-center mt-1 h-1.5 pointer-events-none">
                      {/* Show emerald dots representing withoutKids */}
                      {Array.from({ length: Math.min(withoutKids, 3) }).map((_, idx) => (
                        <span 
                          key={`nokid-${idx}`} 
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-emerald-950' : 'bg-emerald-500'}`} 
                        />
                      ))}
                      {/* Show blue dots representing withKids */}
                      {Array.from({ length: Math.min(withKids, 3) }).map((_, idx) => (
                        <span 
                          key={`kid-${idx}`} 
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-blue-950' : 'bg-blue-400'}`} 
                        />
                      ))}
                      {/* Show amber dots representing vacation */}
                      {Array.from({ length: Math.min(vacation, 2) }).map((_, idx) => (
                        <span 
                          key={`vac-${idx}`} 
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-zinc-950' : 'bg-amber-400'}`} 
                        />
                      ))}
                    </div>

                    {/* Available count badge if text selected is not active, helpful for quick counts */}
                    {totalAvailable > 0 && (
                      <span className={`
                        absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-1
                        ${isSelected 
                          ? 'bg-black ring-orange-500' 
                          : 'bg-orange-500 ring-[#0F0F0F] shadow-sm'
                        }
                      `} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
