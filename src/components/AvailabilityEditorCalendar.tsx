/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AvailabilityStatus } from '../types';
import { SUMMER_MONTHS, WEEKDAYS_SHORT, getDateString } from '../utils/dateHelpers';
import { getStatusColors } from './AvailabilityLegend';
import { Sparkles, Check, Eraser, Trash2, CalendarRange } from 'lucide-react';

interface AvailabilityEditorCalendarProps {
  availability: Record<string, AvailabilityStatus>;
  activeStatusBrush: AvailabilityStatus;
  onChange: (updatedAvailability: Record<string, AvailabilityStatus>) => void;
}

export const AvailabilityEditorCalendar: React.FC<AvailabilityEditorCalendarProps> = ({
  availability,
  activeStatusBrush,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const touchLastDateRef = useRef<string | null>(null);

  // Stop dragging on window mouse up
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleDaySelect = (dateStr: string) => {
    const currentStatus = availability[dateStr] || AvailabilityStatus.NOT_AVAILABLE;
    
    // If clicking without dragging, paint or toggles state
    const newAvailability = { ...availability };
    if (currentStatus === activeStatusBrush) {
      // Toggle off if they click already active brush state
      newAvailability[dateStr] = AvailabilityStatus.NOT_AVAILABLE;
    } else {
      newAvailability[dateStr] = activeStatusBrush;
    }
    onChange(newAvailability);
  };

  const handleMouseDown = (dateStr: string, e: React.MouseEvent) => {
    // Only drag with left click
    if (e.button !== 0) return;
    setIsDragging(true);
    
    const newAvailability = { ...availability };
    newAvailability[dateStr] = activeStatusBrush;
    onChange(newAvailability);
  };

  const handleMouseEnter = (dateStr: string) => {
    if (isDragging) {
      const newAvailability = { ...availability };
      newAvailability[dateStr] = activeStatusBrush;
      onChange(newAvailability);
    }
  };

  // Touch handlers to support drag on mobile devices
  const handleTouchStart = (dateStr: string, e: React.TouchEvent) => {
    setIsDragging(true);
    touchLastDateRef.current = dateStr;
    
    const newAvailability = { ...availability };
    newAvailability[dateStr] = activeStatusBrush;
    onChange(newAvailability);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    if (!touch) return;

    // Retrieve element pointing under user's finger
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    // Find the closest elements containing data-calendar-date
    const dateElement = element.closest('[data-calendar-date]');
    if (dateElement) {
      const dateStr = dateElement.getAttribute('data-calendar-date');
      if (dateStr && dateStr !== touchLastDateRef.current) {
        touchLastDateRef.current = dateStr;
        
        const newAvailability = { ...availability };
        newAvailability[dateStr] = activeStatusBrush;
        onChange(newAvailability);
        
        // Prevent default zoom/scrolling behavior when dragging on calendar
        if (e.cancelable) e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchLastDateRef.current = null;
  };

  // Bulk actions
  const markAllDays = (status: AvailabilityStatus) => {
    const newAvailability = { ...availability };
    SUMMER_MONTHS.forEach((m) => {
      for (let d = 1; d <= m.daysCount; d++) {
        const dateStr = getDateString(m.year, m.monthIndex, d);
        newAvailability[dateStr] = status;
      }
    });
    onChange(newAvailability);
  };

  const clearAllDays = () => {
    const newAvailability = { ...availability };
    SUMMER_MONTHS.forEach((m) => {
      for (let d = 1; d <= m.daysCount; d++) {
        const dateStr = getDateString(m.year, m.monthIndex, d);
        delete newAvailability[dateStr];
      }
    });
    onChange(newAvailability);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Quick Bulk Operations */}
      <div className="p-3 bg-[#141414] border border-[#2A2A2A] rounded-2xl flex flex-wrap gap-2 items-center justify-between">
        <span className="text-xs font-semibold text-zinc-450 flex items-center gap-1">
          <CalendarRange className="w-3.5 h-3.5 text-orange-500" />
          Hurtigvalg:
        </span>
        <div className="flex gap-2 w-full xs:w-auto">
          <button
            type="button"
            onClick={() => markAllDays(activeStatusBrush)}
            className="flex-1 xs:flex-initial text-xs px-2.5 py-1.5 bg-[#0F0F0F] hover:bg-[#1C1C1C] text-zinc-200 rounded-lg border border-[#2A2A2A] transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-orange-500" />
            Sett alle til denne statusen
          </button>
          <button
            type="button"
            onClick={clearAllDays}
            className="text-xs px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950/80 text-red-500 rounded-lg border border-red-900/40 transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Tøm alle
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {SUMMER_MONTHS.map((m) => {
          // Empty slots before month start on calendar grid
          const offset = m.startDayOfWeek === 0 ? 6 : m.startDayOfWeek - 1; // 1 (Mon) -> 0 offset, 0 (Sun) -> 6 offset
          const blanks = Array(offset).fill(null);
          
          // Generate active month days list
          const days = [];
          for (let d = 1; d <= m.daysCount; d++) {
            days.push(d);
          }

          return (
            <div key={m.name} className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl">
              <h4 className="text-sm font-bold text-zinc-200 mb-3">{m.name}</h4>
              
              {/* Short Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {WEEKDAYS_SHORT.map((dayLabel) => (
                  <span key={dayLabel} className="text-[10px] font-bold text-zinc-500 py-1">
                    {dayLabel}
                  </span>
                ))}
              </div>

              {/* Calendar Grid cells */}
              <div 
                className="grid grid-cols-7 gap-1.5"
                onTouchMove={handleTouchMove}
              >
                {blanks.map((_, i) => (
                  <div key={`blank-${i}`} className="aspect-square opacity-0" />
                ))}

                {days.map((day) => {
                  const dateStr = getDateString(m.year, m.monthIndex, day);
                  const status = availability[dateStr] || AvailabilityStatus.NOT_AVAILABLE;
                  const { bg, icon } = getStatusColors(status);
                  
                  // Highlight states
                  const isNone = status === AvailabilityStatus.NOT_AVAILABLE;

                  return (
                    <div
                      key={dateStr}
                      data-calendar-date={dateStr}
                      onMouseDown={(e) => handleMouseDown(dateStr, e)}
                      onMouseEnter={() => handleMouseEnter(dateStr)}
                      onTouchStart={(e) => handleTouchStart(dateStr, e)}
                      onTouchEnd={handleTouchEnd}
                      onClick={() => handleDaySelect(dateStr)}
                      className={`
                        aspect-square relative flex flex-col items-center justify-center rounded-xl cursor-pointer
                        transition-all duration-150 border active:scale-95 text-xs font-semibold select-none
                        ${isNone ? 'bg-[#0F0F0F] border-[#2A2A2A] hover:border-zinc-700 text-zinc-400 hover:bg-[#1A1A1A]' : `${bg} border-transparent`}
                      `}
                    >
                      <span className="relative z-10">{day}</span>
                      {icon && (
                        <span className="absolute bottom-1 right-1 text-[9px] line-clamp-1 select-none pointer-events-none">
                          {icon}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
