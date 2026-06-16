/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Friend, AvailabilityStatus } from '../types';
import { getAllSummerDates, getIsoWeekNumber } from '../utils/dateHelpers';
import { Plus, UserPlus, FileText, CheckCircle2, User, ChevronRight, Edit2, Sparkles, Smile } from 'lucide-react';

interface FriendsListViewProps {
  friends: Friend[];
  onAddFriend: () => void;
  onEditFriend: (friend: Friend) => void;
}

export const FriendsListView: React.FC<FriendsListViewProps> = ({
  friends,
  onAddFriend,
  onEditFriend,
}) => {

  const getAvailabilityStats = (friend: Friend) => {
    let withoutKids = 0;
    let withKids = 0;
    let vacation = 0;

    Object.values(friend.availability).forEach((status) => {
      if (status === AvailabilityStatus.AVAILABLE_WITHOUT_KIDS) withoutKids++;
      if (status === AvailabilityStatus.AVAILABLE_WITH_KIDS) withKids++;
      if (status === AvailabilityStatus.ON_VACATION) vacation++;
    });

    return { withoutKids, withKids, vacation, total: withoutKids + withKids + vacation };
  };

  interface WeekStats {
    withoutKids: number;
    withKids: number;
    vacation: number;
    total: number;
  }

  const weekNumbers = Array.from(
    new Set(getAllSummerDates().map(getIsoWeekNumber))
  ).sort((a, b) => a - b);

  const getFriendWeekStatus = (friend: Friend) => {
    const weekMap = new Map<number, WeekStats>();

    getAllSummerDates().forEach((dateStr) => {
      const week = getIsoWeekNumber(dateStr);
      const status = friend.availability[dateStr] ?? AvailabilityStatus.NOT_AVAILABLE;
      const existing = weekMap.get(week) ?? { withoutKids: 0, withKids: 0, vacation: 0, total: 0 };

      if (status === AvailabilityStatus.AVAILABLE_WITHOUT_KIDS) existing.withoutKids += 1;
      else if (status === AvailabilityStatus.AVAILABLE_WITH_KIDS) existing.withKids += 1;
      else if (status === AvailabilityStatus.ON_VACATION) existing.vacation += 1;
      existing.total += 1;
      weekMap.set(week, existing);
    });

    return weekMap;
  };

  const getWeekCellProps = (weekStats?: WeekStats) => {
    if (!weekStats || weekStats.total === 0) {
      return { className: 'bg-zinc-200' };
    }

    if (weekStats.withoutKids > 0) {
      return { className: 'bg-green-200' };
    }
    if (weekStats.withKids > 0) {
      return { className: 'bg-blue-200' };
    }
    if (weekStats.vacation > 0) {
      return { className: 'bg-yellow-200' };
    }

    return { className: 'bg-zinc-200' };
  };

  return (
    <div className="space-y-4 animate-fade-in text-zinc-800">
      {/* Top Banner and Quick Launch button */}
      <div className="p-4 bg-[#FFFFFF] border border-[#DDDDDD] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <Smile className="w-4 h-4 text-orange-500" />
            Venneadministrasjon ({friends.length})
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[320px] leading-normal font-medium">
            Legg til dine venner, og klikk deg inn på profilen deres for å planlegge og tilpasse dagene de er ledige.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddFriend}
          className="py-3 px-4 bg-orange-500 hover:bg-orange-600 text-black text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-97 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-black stroke-[3px]" />
          Legg til venn
        </button>
      </div>

      {/* Friends grid/list */}
      {friends.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#FFFFFF] border border-[#DDDDDD] rounded-2xl">
          <User className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-zinc-500">Ingen venner lagt til ennå</h4>
          <p className="text-xs text-zinc-500 mt-1.5 max-w-[280px] mx-auto">
            Trykk på knappen over for å registrere din første venn og begynne planleggingen for sommeren.
          </p>
          <button
            type="button"
            onClick={onAddFriend}
            className="mt-5 inline-flex items-center gap-1.5 px-4 w-auto py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all select-none border border-zinc-200"
          >
            Come on, spark i gang!
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto bg-[#FFFFFF] border border-[#DDDDDD] rounded-2xl">
            <table className="min-w-[760px] w-full border-collapse text-[10px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-[#FFFFFF] p-2 text-left font-bold text-zinc-700 border-r border-white">Navn</th>
                  {weekNumbers.map((week) => (
                    <th key={week} className="p-2 text-center font-bold text-zinc-500 uppercase border-l border-white tracking-[0.18em]">
                      Uke {week}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {friends.map((friend) => {
                  const weekMap = getFriendWeekStatus(friend);
                  return (
                    <tr key={friend.id} className="border-t border-white">
                      <td className="sticky left-0 z-10 bg-[#FFFFFF] p-2 text-[11px] font-semibold text-zinc-800 border-r border-white">
                        {friend.name}
                      </td>
                      {weekNumbers.map((week) => {
                        const weekStats = weekMap.get(week);
                        const { className } = getWeekCellProps(weekStats);
                        return (
                          <td key={week} className={`p-2 border-l border-white ${className}`}>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
          {friends.map((f) => {
            const stats = getAvailabilityStats(f);
            
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onEditFriend(f)}
                className="w-full text-left p-4 bg-[#FFFFFF] hover:bg-zinc-50 border border-[#DDDDDD] hover:border-zinc-300 rounded-2xl flex items-center justify-between transition-all group cursor-pointer active:scale-99"
              >
                <div className="min-w-0 pr-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-xs font-black text-white shadow-md">
                      {f.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-800 group-hover:text-black transition-colors truncate font-sans">
                      {f.name}
                    </h4>
                  </div>

                  {/* Notes snippet */}
                  {f.notes ? (
                    <p className="text-xs text-zinc-500 italic line-clamp-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{f.notes}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-zinc-500 italic">Ingen notater</p>
                  )}

                  {/* Activity Badge Stats Row */}
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {stats.total === 0 ? (
                      <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
                        Ingen dager markert
                      </span>
                    ) : (
                      <>
                        {stats.withoutKids > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🍻 {stats.withoutKids}
                          </span>
                        )}
                        {stats.withKids > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            👶 {stats.withKids}
                          </span>
                        )}
                        {stats.vacation > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            ☀️ {stats.vacation}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div className="text-right mr-1.5 hidden xs:block">
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase">Dager ledig</span>
                    <span className="text-xs font-mono font-bold text-zinc-600">{stats.withoutKids + stats.withKids}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};