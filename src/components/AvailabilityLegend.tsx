/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AvailabilityStatus } from '../types';

interface LegendItemProps {
  colorClass: string;
  label: string;
  icon?: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ colorClass, label, icon }) => {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-xs">
      <div className={`w-4 h-4 rounded-full ${colorClass} shrink-0`} />
      <span className="text-sm font-medium text-zinc-350">
        {label} {icon && <span className="ml-0.5">{icon}</span>}
      </span>
    </div>
  );
};

export const AvailabilityLegend: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <LegendItem 
        colorClass="bg-zinc-800 border border-zinc-700" 
        label="Ikke tilgjengelig" 
      />
      <LegendItem 
        colorClass="bg-emerald-600 shadow-sm shadow-emerald-900/40" 
        label="Uten barn" 
        icon="🍻" 
      />
      <LegendItem 
        colorClass="bg-blue-600 shadow-sm shadow-blue-900/40" 
        label="Med barn" 
        icon="👶" 
      />
      <LegendItem 
        colorClass="bg-amber-500 shadow-sm shadow-amber-500/40" 
        label="På ferie" 
        icon="☀️" 
      />
    </div>
  );
};

export const getStatusColors = (status: AvailabilityStatus | undefined): { bg: string; text: string; label: string; icon: string } => {
  switch (status) {
    case AvailabilityStatus.AVAILABLE_WITHOUT_KIDS:
      return {
        bg: 'bg-emerald-600 text-white',
        text: 'text-emerald-400',
        label: 'Tilgjengelig uten barn',
        icon: '🍻',
      };
    case AvailabilityStatus.AVAILABLE_WITH_KIDS:
      return {
        bg: 'bg-blue-600 text-white',
        text: 'text-blue-400',
        label: 'Tilgjengelig med barn',
        icon: '👶',
      };
    case AvailabilityStatus.ON_VACATION:
      return {
        bg: 'bg-amber-500 text-zinc-950 font-semibold',
        text: 'text-amber-400',
        label: 'På ferie',
        icon: '☀️',
      };
    case AvailabilityStatus.NOT_AVAILABLE:
    default:
      return {
        bg: 'bg-zinc-800 text-zinc-400',
        text: 'text-zinc-500',
        label: 'Ikke tilgjengelig',
        icon: '',
      };
  }
};
