/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Friend, AvailabilityStatus } from '../types';
import { AvailabilityEditorCalendar } from './AvailabilityEditorCalendar';
import { ArrowLeft, Check, Trash2, HelpCircle, Save, X, Edit, Info, AlertTriangle } from 'lucide-react';

interface FriendFormProps {
  friend?: Friend;
  onSave: (name: string, notes: string, availability: Record<string, AvailabilityStatus>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const FriendForm: React.FC<FriendFormProps> = ({
  friend,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [name, setName] = useState(friend?.name || '');
  const [notes, setNotes] = useState(friend?.notes || '');
  const [availability, setAvailability] = useState<Record<string, AvailabilityStatus>>(
    friend?.availability || {}
  );
  
  // Selection brush for painting on calendar days
  const [brush, setBrush] = useState<AvailabilityStatus>(AvailabilityStatus.AVAILABLE_WITHOUT_KIDS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vennens navn kan ikke være tomt!');
      return;
    }
    setErrorMsg(null);
    onSave(name.trim(), notes.trim(), availability);
  };

  const brushOptions = [
    {
      status: AvailabilityStatus.AVAILABLE_WITHOUT_KIDS,
      label: 'Tilgjengelig uten barn',
      icon: '🍻',
      colorClass: 'bg-emerald-600 border-emerald-500 text-white',
      accentColor: 'border-emerald-500 ring-emerald-500/30'
    },
    {
      status: AvailabilityStatus.AVAILABLE_WITH_KIDS,
      label: 'Tilgjengelig med barn',
      icon: '👶',
      colorClass: 'bg-blue-600 border-blue-500 text-white',
      accentColor: 'border-blue-500 ring-blue-500/30'
    },
    {
      status: AvailabilityStatus.ON_VACATION,
      label: 'På ferie',
      icon: '☀️',
      colorClass: 'bg-amber-500 border-amber-400 text-zinc-950',
      accentColor: 'border-amber-400 ring-amber-500/30'
    },
    {
      status: AvailabilityStatus.NOT_AVAILABLE,
      label: 'Ikke tilgjengelig',
      icon: '❌',
      colorClass: 'bg-zinc-800 border-zinc-700 text-zinc-300',
      accentColor: 'border-zinc-750 ring-zinc-700/30'
    },
  ];

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-zinc-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake
        </button>
        <span className="text-sm font-bold text-zinc-350">
          {friend ? 'Rediger venn' : 'Legg til ny venn'}
        </span>
        <div className="w-16" /> {/* Spacer to align title */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="space-y-4 bg-[#141414] p-4 border border-[#2A2A2A] rounded-2xl">
          <div>
            <label htmlFor="friendName" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Vennens navn <span className="text-red-500">*</span>
            </label>
            <input
              id="friendName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setErrorMsg(null);
              }}
              placeholder="F.eks. Kari Nordmann"
              className="w-full px-3.5 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-sm text-white"
            />
          </div>

          <div>
            <label htmlFor="friendNotes" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Notater (frivillig)
            </label>
            <textarea
              id="friendNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="F.eks. 'Samboer har barna i partallsuker', 'Jobber kveldsvakter'"
              rows={2}
              className="w-full px-3.5 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-sm text-white resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-900/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Brush Tool Palette */}
        <div className="bg-[#141414] p-4 border border-[#2A2A2A] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Malepensel (Velg status under)
            </span>
            <div className="flex items-center gap-1 text-[10px] text-orange-400 font-semibold bg-orange-950/20 px-2 py-0.5 rounded-lg border border-orange-500/20">
              <Info className="w-3 h-3 text-orange-500" />
              <span>Sveip over dager for å fargelegge!</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {brushOptions.map((opt) => {
              const isSelected = brush === opt.status;
              return (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => setBrush(opt.status)}
                  className={`
                    p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer active:scale-97
                    ${isSelected 
                      ? `${opt.colorClass} border-orange-500 ring-4 ${opt.accentColor} shadow-md` 
                      : 'bg-[#0F0F0F] border-[#2A2A2A] text-zinc-400 hover:border-zinc-700/80 hover:text-zinc-200'
                    }
                  `}
                >
                  <span className="text-xl leading-none select-none">{opt.icon}</span>
                  <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-zinc-550 leading-normal text-center pt-1.5 border-t border-[#2A2A2A]">
            Hold fingeren nede på mobilen eller venstre musetast på PC-en, og dra over de ønskede dagene på kalenderen for å fargelegge raskt! Link til en enkelt dag fjerner/legger til statusen direkte.
          </p>
        </div>

        {/* Interactive Month Calendars details */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 px-1">
            Fargelegg tilgjengelighet (Juni, Juli, August 2026)
          </h3>
          <AvailabilityEditorCalendar
            availability={availability}
            activeStatusBrush={brush}
            onChange={setAvailability}
          />
        </div>

        {/* Action button triggers */}
        <div className="pt-4 border-t border-[#2A2A2A] space-y-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-black rounded-xl font-black flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4 text-black stroke-[3px]" />
            {friend ? 'Lagre endringer' : 'Opprett venn'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 bg-[#141414] border border-[#2A2A2A] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            Avbryt
          </button>

          {friend && onDelete && (
            <div className="pt-4 mt-4 border-t border-red-900/30">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 px-4 bg-red-950/30 border border-red-900/30 hover:bg-red-950/60 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Slett {name || 'venn'}
                </button>
              ) : (
                <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">Er du helt sikker?</h4>
                  <p className="text-xs text-red-400/90 leading-normal">
                    Dette vil fjerne <strong>{name}</strong> og all tilhørende tilgjengelighet permanent. Handlingen kan ikke angres.
                  </p>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={onDelete}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all p-1"
                    >
                      Ja, slett permanent
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all p-1"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
