/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Friend, AvailabilityStatus, FilterType } from './types';
import { PRELOADED_FRIENDS } from './data/preloadFriends';
import { formatDateNorwegian } from './utils/dateHelpers';
import { CalendarView } from './components/CalendarView';
import { WeeklyOverview } from './components/WeeklyOverview';
import { FriendsListView } from './components/FriendsListView';
import { BestDaysView } from './components/BestDaysView';
import { FriendForm } from './components/FriendForm';
import { AvailabilityLegend, getStatusColors } from './components/AvailabilityLegend';
import { 
  Calendar, 
  Users, 
  Trophy, 
  UserPlus, 
  Wine, 
  Baby, 
  Plane, 
  Moon, 
  Sparkles,
  CalendarDays,
  FileEdit,
  Plus,
  HelpCircle,
  Undo2
} from 'lucide-react';

export default function App() {
  // Application states
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-16'); // Starts on simulated June 16, 2026
  const [currentTab, setCurrentTab] = useState<'CALENDAR' | 'FRIENDS' | 'BEST_DAYS'>('CALENDAR');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  
  // Creation / editing flow
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [isCreatingFriend, setIsCreatingFriend] = useState<boolean>(false);
  
  // Initialize data on mounting
  useEffect(() => {
    const stored = localStorage.getItem('sommerplan2026_friends');
    if (stored) {
      try {
        setFriends(JSON.parse(stored));
      } catch (e) {
        console.error('Klarte ikke å deseralisere lagret vennedata.', e);
        setFriends(PRELOADED_FRIENDS);
      }
    } else {
      // Preload so the user starts with demo values
      setFriends(PRELOADED_FRIENDS);
      localStorage.setItem('sommerplan2026_friends', JSON.stringify(PRELOADED_FRIENDS));
    }
  }, []);

  // Save to localStorage whenever friends updates
  const saveFriends = (updatedFriends: Friend[]) => {
    setFriends(updatedFriends);
    localStorage.setItem('sommerplan2026_friends', JSON.stringify(updatedFriends));
  };

  // Create friend handler
  const handleCreateFriendSubmit = (name: string, notes: string, availability: Record<string, AvailabilityStatus>) => {
    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name,
      notes,
      availability,
    };
    const updated = [...friends, newFriend];
    saveFriends(updated);
    setIsCreatingFriend(false);
  };

  // Edit friend handler
  const handleEditFriendSubmit = (name: string, notes: string, availability: Record<string, AvailabilityStatus>) => {
    if (!editingFriend) return;
    const updated = friends.map((f) => 
      f.id === editingFriend.id 
        ? { ...f, name, notes, availability } 
        : f
    );
    saveFriends(updated);
    setEditingFriend(null);
  };

  // Delete friend handler
  const handleDeleteFriend = () => {
    if (!editingFriend) return;
    const updated = friends.filter((f) => f.id !== editingFriend.id);
    saveFriends(updated);
    setEditingFriend(null);
  };

  // Seed default data helper if they delete all
  const handleRestoreDemoData = () => {
    if (window.confirm('Vil du gjenopprette standard demo-venner? Eventuelle egne endringer vil bli overskrevet.')) {
      saveFriends(PRELOADED_FRIENDS);
    }
  };

  // Filter friends on current clicked date
  const getFriendsAvailableOnSelectedDate = () => {
    return friends.filter((f) => {
      const status = f.availability[selectedDate];
      if (!status || status === AvailabilityStatus.NOT_AVAILABLE) return false;
      
      switch (filterType) {
        case 'NO_KIDS':
          return status === AvailabilityStatus.AVAILABLE_WITHOUT_KIDS;
        case 'WITH_KIDS':
          return status === AvailabilityStatus.AVAILABLE_WITH_KIDS;
        case 'VACATION':
          return status === AvailabilityStatus.ON_VACATION;
        case 'ALL':
        default:
          return true; // Any non-empty status
      }
    });
  };

  const availableFriends = getFriendsAvailableOnSelectedDate();

  // Custom UI variables
  const formattedSelectedDay = formatDateNorwegian(selectedDate);

  // Sub-renders
  const renderTabContent = () => {
    switch (currentTab) {
      case 'FRIENDS':
        return (
          <FriendsListView 
            friends={friends}
            onAddFriend={() => setIsCreatingFriend(true)}
            onEditFriend={(f) => setEditingFriend(f)}
          />
        );
      case 'BEST_DAYS':
        return (
          <BestDaysView 
            friends={friends}
            onSelectDate={setSelectedDate}
            onNavigateToCalendar={() => setCurrentTab('CALENDAR')}
          />
        );
      case 'CALENDAR':
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Weekly Grid Overview */}
            <WeeklyOverview friends={friends} />

            {/* Legend explaining states */}
            <div className="p-3 bg-[#141414] border border-[#2A2A2A] rounded-2xl">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Fargekoder:</span>
              <AvailabilityLegend />
            </div>

            {/* Three Months Calendar view */}
            <CalendarView 
              friends={friends}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Selected Date Drawer/Card */}
            <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Valgt dato</span>
                  <h3 className="text-base font-bold text-zinc-150 flex items-center gap-1.5 leading-none mt-0.5">
                    <CalendarDays className="w-4 h-4 text-orange-500" />
                    {formattedSelectedDay}
                  </h3>
                </div>
                
                <span className="px-2.5 py-1 bg-[#0F0F0F] font-mono text-[11px] font-bold text-[#F5F5F5] rounded-lg border border-[#2A2A2A]">
                  {availableFriends.length} ledige
                </span>
              </div>

              {/* Internal filters for the active date card */}
              <div className="flex flex-wrap gap-1 p-0.5 bg-[#0F0F0F] rounded-lg border border-[#2A2A2A]">
                {(['ALL', 'NO_KIDS', 'WITH_KIDS', 'VACATION'] as FilterType[]).map((tab) => {
                  let label = 'Alle';
                  let icon = '🍻 / 👶';
                  if (tab === 'NO_KIDS') { label = 'Uten barn'; icon = '🍻'; }
                  if (tab === 'WITH_KIDS') { label = 'Med barn'; icon = '👶'; }
                  if (tab === 'VACATION') { label = 'Ferie'; icon = '☀️'; }
                  
                  const isSelected = filterType === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFilterType(tab)}
                      className={`
                        flex-1 text-center py-1.5 px-1 text-[11px] font-bold rounded-md transition-all cursor-pointer
                        ${isSelected ? 'bg-orange-500 text-black font-black shadow-xs' : 'text-zinc-500 hover:text-zinc-300'}
                      `}
                    >
                      <span>{icon}</span>
                      <span className="hidden xs:inline ml-1">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Friends list for selected date */}
              {availableFriends.length === 0 ? (
                <div className="text-center py-10 px-2 bg-[#0F0F0F]/45 border border-[#2A2A2A] rounded-xl">
                  <p className="text-xs text-zinc-400 font-medium">Ingen ledige venner på denne datoen</p>
                  <p className="text-[10px] text-zinc-500 mt-1 max-w-[240px] mx-auto">
                    Trykk på en annen dato, eller gå til 'Venner'-fanen for å merke noen ledige her!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {availableFriends.map((f) => {
                    const status = f.availability[selectedDate];
                    const { bg, icon, label } = getStatusColors(status);
                    
                    return (
                      <div 
                        key={f.id}
                        className="p-3 bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-[#2A2A2A] hover:border-zinc-700 rounded-xl flex items-center justify-between gap-3 group transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-orange-500">
                              ●
                            </span>
                            <span className="text-sm font-bold text-zinc-150 truncate">
                              {f.name}
                            </span>
                          </div>
                          
                          {f.notes && (
                            <p className="text-xs text-zinc-400 italic mt-1 pl-3 line-clamp-2 leading-relaxed border-l border-[#2A2A2A]">
                              {f.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Colored status badge */}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg ${bg}`}>
                            <span>{icon}</span>
                            <span className="hidden xxs:inline text-[10px]">{label}</span>
                          </span>

                          {/* Quick edit shortcut */}
                          <button
                            type="button"
                            onClick={() => setEditingFriend(f)}
                            className="p-1.5 bg-[#141414] hover:bg-[#1C1C1C] text-zinc-400 hover:text-zinc-200 border border-[#2A2A2A] rounded-lg transition-colors group-hover:block cursor-pointer"
                            title="Endre"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const activeFormOrTabContent = () => {
    if (isCreatingFriend) {
      return (
        <FriendForm 
          onSave={handleCreateFriendSubmit}
          onCancel={() => setIsCreatingFriend(false)}
        />
      );
    }
    if (editingFriend) {
      return (
        <FriendForm 
          friend={editingFriend}
          onSave={handleEditFriendSubmit}
          onCancel={() => setEditingFriend(null)}
          onDelete={handleDeleteFriend}
        />
      );
    }
    return (
      <div className="space-y-6 pb-26 animate-slide-up">
        {renderTabContent()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5] selection:bg-orange-500/30 font-sans flex flex-col max-w-2xl mx-auto border-x border-[#2A2A2A] shadow-2xl relative">
      {/* Dynamic Native-feel Header or Title Area */}
      <header className="px-5 py-4 bg-[#141414] border-b border-[#2A2A2A] shrink-0 select-none sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg">S</div>
            <div className="space-y-0.5">
              <h1 className="text-base font-black tracking-tight text-white leading-none">
                Sommerplan <span className="text-orange-500">2026</span>
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">Juni, Juli & August ferieoversikt</p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isCreatingFriend && !editingFriend && (
              <button
                type="button"
                onClick={() => setIsCreatingFriend(true)}
                className="p-2.5 bg-orange-500 hover:bg-orange-600 text-black rounded-xl active:scale-95 transition-all cursor-pointer shadow-md"
                title="Legg til ny venn"
              >
                <Plus className="w-5 h-5 text-black stroke-[3px]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main scrolling viewport */}
      <main className="flex-1 px-4 py-5 space-y-6">
        {activeFormOrTabContent()}
      </main>

      {/* Sticky Bottom Tab Bar - mobile standard design */}
      {!isCreatingFriend && !editingFriend && (
        <nav className="sticky bottom-0 left-0 right-0 py-3 px-4 bg-[#141414]/95 border-t border-[#2A2A2A] backdrop-blur-md flex justify-around items-center z-40 select-none shrink-0 shadow-lg">
          <button
            type="button"
            onClick={() => setCurrentTab('CALENDAR')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentTab === 'CALENDAR' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-5.5 h-5.5 shrink-0" />
            <span className="text-[11px] font-bold">Kalender</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('FRIENDS')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentTab === 'FRIENDS' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-5.5 h-5.5 shrink-0" />
            <span className="text-[11px] font-bold">Venner ({friends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('BEST_DAYS')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentTab === 'BEST_DAYS' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-5.5 h-5.5 shrink-0" />
            <span className="text-[11px] font-bold">Beste dager</span>
          </button>
        </nav>
      )}

      {/* Footer credits - simplified and moved to bottom of content scroll if needed, but here as small discreet text */}
      <footer className="py-6 border-t border-[#2A2A2A] mt-auto shrink-0 select-none bg-[#0F0F0F]">
        <div className="px-6 flex flex-col items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium text-center">
          <span>Sommerplan 2026 © Planleggingsverktøy for vennegjengen</span>
          <button
            type="button"
            onClick={handleRestoreDemoData}
            className="hover:text-zinc-300 transition-colors cursor-pointer underline underline-offset-2"
          >
            Gjenopprett Demo-data
          </button>
        </div>
      </footer>
    </div>
  );
}
