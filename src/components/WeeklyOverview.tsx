import React from 'react';
import { Friend, AvailabilityStatus } from '../types';
import { Users } from 'lucide-react';

interface WeeklyOverviewProps {
  friends: Friend[];
}

interface WeekDef {
  label: string;
  range: string;
  days: string[];
}

// Generate date strings for a specific range
const getDaysInRange = (startDay: number, startMonth: number, count: number): string[] => {
  const days: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(2026, startMonth, startDay + i);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${d}`);
  }
  return days;
};

const WEEKS: WeekDef[] = [
  { label: 'Uke 23', range: '1-7. jun', days: getDaysInRange(1, 5, 7) },
  { label: 'Uke 24', range: '8-14. jun', days: getDaysInRange(8, 5, 7) },
  { label: 'Uke 25', range: '15-21. jun', days: getDaysInRange(15, 5, 7) },
  { label: 'Uke 26', range: '22-28. jun', days: getDaysInRange(22, 5, 7) },
  { label: 'Uke 27', range: '29. jun-5. jul', days: getDaysInRange(29, 5, 7) },
  { label: 'Uke 28', range: '6-12. jul', days: getDaysInRange(6, 6, 7) },
  { label: 'Uke 29', range: '13-19. jul', days: getDaysInRange(13, 6, 7) },
  { label: 'Uke 30', range: '20-26. jul', days: getDaysInRange(20, 6, 7) },
  { label: 'Uke 31', range: '27. jul-2. aug', days: getDaysInRange(27, 6, 7) },
  { label: 'Uke 32', range: '3-9. aug', days: getDaysInRange(3, 7, 7) },
  { label: 'Uke 33', range: '10-16. aug', days: getDaysInRange(10, 7, 7) },
  { label: 'Uke 34', range: '17-23. aug', days: getDaysInRange(17, 7, 7) },
  { label: 'Uke 35', range: '24-31. aug', days: getDaysInRange(24, 7, 8) }, // Includes 31st
];

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ friends }) => {
  if (friends.length === 0) return null;

  const getWeekStatus = (friend: Friend, days: string[]) => {
    let hasVacation = false;
    let hasWithoutKids = false;
    let hasWithKids = false;

    days.forEach(day => {
      const status = friend.availability[day];
      if (status === AvailabilityStatus.ON_VACATION) hasVacation = true;
      if (status === AvailabilityStatus.AVAILABLE_WITHOUT_KIDS) hasWithoutKids = true;
      if (status === AvailabilityStatus.AVAILABLE_WITH_KIDS) hasWithKids = true;
    });

    return { hasVacation, hasWithoutKids, hasWithKids };
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
      <div className="p-3 border-b border-[#2A2A2A] flex items-center gap-2">
        <Users className="w-4 h-4 text-orange-500" />
        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-100">Ukesoversikt</h3>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-[#141414] p-3 text-[10px] font-bold text-zinc-550 uppercase tracking-tighter border-r border-[#2A2A2A] min-w-[100px]">
                Navn
              </th>
              {WEEKS.map(w => (
                <th key={w.label} className="p-3 text-[10px] text-center border-r border-[#2A2A2A]/50 last:border-r-0">
                  <div className="font-black text-zinc-200">{w.label}</div>
                  <div className="text-[9px] text-zinc-500 font-medium whitespace-nowrap">{w.range}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {friends.map(f => (
              <tr key={f.id} className="border-t border-[#2A2A2A]">
                <td className="sticky left-0 z-10 bg-[#141414] p-3 text-xs font-bold text-zinc-100 border-r border-[#2A2A2A] truncate max-w-[100px]">
                  {f.name}
                </td>
                {WEEKS.map(w => {
                  const status = getWeekStatus(f, w.days);
                  return (
                    <td key={w.label} className="p-2 border-r border-[#2A2A2A]/50 last:border-r-0">
                      <div className="flex justify-center gap-0.5">
                        {status.hasVacation && (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" title="Ferie" />
                        )}
                        {status.hasWithoutKids && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Uten barn" />
                        )}
                        {status.hasWithKids && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-400" title="Med barn" />
                        )}
                        {!status.hasVacation && !status.hasWithoutKids && !status.hasWithKids && (
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
