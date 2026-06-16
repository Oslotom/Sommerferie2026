/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Friend, AvailabilityStatus } from '../types';
import { getAllSummerDates, formatDateNorwegian } from '../utils/dateHelpers';
import { Trophy, Calendar, Users, Wine, Baby, Plane } from 'lucide-react';

interface BestDaysViewProps {
  friends: Friend[];
  onSelectDate: (dateStr: string) => void;
  onNavigateToCalendar: () => void;
}

export const BestDaysView: React.FC<BestDaysViewProps> = ({
  friends,
  onSelectDate,
  onNavigateToCalendar,
}) => {
  // Option to filter how we define "tilgjengelig"
  const [bestDayFilter, setBestDayFilter] = useState<'ALL_ACTIVE' | 'WITHOUT_KIDS' | 'WITH_KIDS' | 'VACATION'>('ALL_ACTIVE');

  // Compute stats for all dates
  const allDates = getAllSummerDates();
  
  const dayStatsList = allDates.map((dateStr) => {
    const availableWithoutKids: Friend[] = [];
    const availableWithKids: Friend[] = [];
    const onVacation: Friend[] = [];

    friends.forEach((friend) => {
      const status = friend.availability[dateStr];
      if (status === AvailabilityStatus.AVAILABLE_WITHOUT_KIDS) {
        availableWithoutKids.push(friend);
      } else if (status === AvailabilityStatus.AVAILABLE_WITH_KIDS) {
        availableWithKids.push(friend);
      } else if (status === AvailabilityStatus.ON_VACATION) {
        onVacation.push(friend);
      }
    });

    let score = 0;
    if (bestDayFilter === 'ALL_ACTIVE') {
      score = availableWithoutKids.length + availableWithKids.length;
    } else if (bestDayFilter === 'WITHOUT_KIDS') {
      score = availableWithoutKids.length;
    } else if (bestDayFilter === 'WITH_KIDS') {
      score = availableWithKids.length;
    } else if (bestDayFilter === 'VACATION') {
      score = onVacation.length;
    }

    return {
      dateStr,
      score,
      availableWithoutKids,
      availableWithKids,
      onVacation,
      totalFriends: availableWithoutKids.length + availableWithKids.length + onVacation.length
    };
  });

  // Sort and filter out score === 0 days
  const sortedDays = dayStatsList
    .filter((day) => day.score > 0)
    .sort((a, b) => b.score - a.score || a.dateStr.localeCompare(b.dateStr));

  const handleDateClick = (dateStr: string) => {
    onSelectDate(dateStr);
    onNavigateToCalendar();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl">
        <h3 className="text-sm font-bold text-zinc-100 mb-2.5 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-orange-500" />
          Finn beste aktivitetsdager
        </h3>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-medium">
          Oversikten viser datoer sortert etter hvor mange venner som er ledige. Perfekt for å planlegge grilling, turer eller fester!
        </p>

        {/* Filter Pill Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#0F0F0F] rounded-xl border border-[#2A2A2A]">
          <button
            type="button"
            onClick={() => setBestDayFilter('ALL_ACTIVE')}
            className={`flex-1 text-center py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
              bestDayFilter === 'ALL_ACTIVE' ? 'bg-orange-500 text-black shadow-sm font-black' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Alle tilgjengelige
          </button>
          <button
            type="button"
            onClick={() => setBestDayFilter('WITHOUT_KIDS')}
            className={`text-center py-1.5 px-2.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              bestDayFilter === 'WITHOUT_KIDS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/60 shadow-xs' : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            🍻 Uten barn
          </button>
          <button
            type="button"
            onClick={() => setBestDayFilter('WITH_KIDS')}
            className={`text-center py-1.5 px-2.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              bestDayFilter === 'WITH_KIDS' ? 'bg-blue-950 text-blue-300 border border-blue-900/40 shadow-xs' : 'text-zinc-400 hover:text-blue-400'
            }`}
          >
            👶 Med barn
          </button>
          <button
            type="button"
            onClick={() => setBestDayFilter('VACATION')}
            className={`text-center py-1.5 px-2.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              bestDayFilter === 'VACATION' ? 'bg-amber-950/60 text-amber-300 border border-amber-900/40 shadow-xs' : 'text-zinc-400 hover:text-amber-400'
            }`}
          >
            🏖️ På ferie
          </button>
        </div>
      </div>

      {sortedDays.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl">
          <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-zinc-400">Ingen dager med tilgjengelige venner</h4>
          <p className="text-xs text-zinc-500 mt-1 max-w-[280px] mx-auto">
            Prøv å legge til venner eller marker dager som ledige for å se rangeringen.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedDays.map((day, idx) => {
            const hasScore = day.score > 0;
            
            return (
              <button
                key={day.dateStr}
                onClick={() => handleDateClick(day.dateStr)}
                className="w-full text-left p-3.5 bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] hover:border-zinc-700 rounded-2xl flex items-center justify-between transition-all group max-w-full"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0F0F0F] border border-[#2A2A2A] flex flex-col items-center justify-center text-zinc-450 group-hover:border-zinc-700 transition-colors shrink-0">
                    <span className="text-[10px] font-black uppercase leading-none text-orange-500">
                      {idx === 0 ? '🏆' : `#${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono font-bold mt-0.5 leading-none">
                      {day.dateStr.split('-')[2]}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                      {formatDateNorwegian(day.dateStr)}
                    </h4>
                    {/* Friends breakdown tags */}
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-[11px] text-zinc-500 font-medium">
                      {day.availableWithoutKids.length > 0 && (
                        <span className="flex items-center gap-0.5 text-emerald-400">
                          <Wine className="w-3 h-3" /> {day.availableWithoutKids.length} uten barn
                        </span>
                      )}
                      {day.availableWithKids.length > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-400">
                          <Baby className="w-3 h-3" /> {day.availableWithKids.length} med barn
                        </span>
                      )}
                      {day.onVacation.length > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Plane className="w-3 h-3" /> {day.onVacation.length} på ferie
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ring-1
                    ${idx === 0 
                      ? 'bg-orange-500/10 text-orange-400 ring-orange-500/25' 
                      : 'bg-[#0F0F0F] text-zinc-300 ring-[#2A2A2A]'
                    }
                  `}>
                    <Users className="w-3.5 h-3.5" />
                    {day.score} {day.score === 1 ? 'venn' : 'venner'} ledig
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
