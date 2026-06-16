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
    <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-zinc-200 rounded-xl shadow-xs">
      <div className={`w-4 h-4 rounded-full ${colorClass} shrink-0`} />
      <span className="text-sm font-medium text-zinc-700">
        {label} {icon && <span className="ml-0.5">{icon}</span>}
      </span>
    </div>
  );
};

export const AvailabilityLegend: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <LegendItem 
        colorClass="bg-zinc-300 border border-zinc-400" 
        label="Ikke tilgjengelig" 
      />
      <LegendItem 
        colorClass="bg-emerald-500 shadow-sm shadow-emerald-500/20" 
        label="Uten barn" 
        icon="🍻" 
      />
      <LegendItem 
        colorClass="bg-blue-500 shadow-sm shadow-blue-500/20" 
        label="Med barn" 
        icon="👶" 
      />
      <LegendItem 
        colorClass="bg-amber-400 shadow-sm shadow-amber-400/20" 
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
        bg: 'bg-emerald-500 text-white',
        text: 'text-emerald-600',
        label: 'Tilgjengelig uten barn',
        icon: '🍻',
      };
    case AvailabilityStatus.AVAILABLE_WITH_KIDS:
      return {
        bg: 'bg-blue-500 text-white',
        text: 'text-blue-600',
        label: 'Tilgjengelig med barn',
        icon: '👶',
      };
    case AvailabilityStatus.ON_VACATION:
      return {
        bg: 'bg-amber-400 text-zinc-950 font-semibold',
        text: 'text-amber-500',
        label: 'På ferie',
        icon: '☀️',
      };
    case AvailabilityStatus.NOT_AVAILABLE:
    default:
      return {
        bg: 'bg-zinc-200 text-zinc-500',
        text: 'text-zinc-400',
        label: 'Ikke tilgjengelig',
        icon: '',
      };
  }
};