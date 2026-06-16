/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Friend, AvailabilityStatus } from './types';
import { PRELOADED_FRIENDS } from './data/preloadFriends';
import { FriendsListView } from './components/FriendsListView';
import { BestDaysView } from './components/BestDaysView';
import { FriendForm } from './components/FriendForm';
import { 
  Users, 
  Trophy, 
  FileEdit,
  Plus,
} from 'lucide-react';

export default function App() {
  // Application states
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentTab, setCurrentTab] = useState<'FRIENDS' | 'BEST_DAYS'>('FRIENDS');
  
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

  // Sub-renders
  const renderTabContent = () => {
    switch (currentTab) {
      case 'BEST_DAYS':
        return (
          <BestDaysView 
            friends={friends}
          />
        );
      case 'FRIENDS':
      default:
        return (
          <FriendsListView 
            friends={friends}
            onAddFriend={() => setIsCreatingFriend(true)}
            onEditFriend={(f) => setEditingFriend(f)}
          />
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
    <div className="min-h-screen bg-white text-zinc-800 selection:bg-orange-500/30 font-sans flex flex-col max-w-2xl mx-auto border-x border-[#DDDDDD] shadow-2xl relative">
      {/* Dynamic Native-feel Header or Title Area */}
      <header className="px-5 py-4 bg-white border-b border-zinc-200 shrink-0 select-none sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg">S</div>
            <div className="space-y-0.5">
              <h1 className="text-base font-black tracking-tight text-zinc-800 leading-none">
                Sommerplan <span className="text-orange-500">2026</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium">Juni, Juli & August ferieoversikt</p>
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
      <main className="flex-1 px-2 py-5 space-y-6">
        {activeFormOrTabContent()}
      </main>

      {/* Sticky Bottom Tab Bar - mobile standard design */}
      {!isCreatingFriend && !editingFriend && (
        <nav className="sticky bottom-0 left-0 right-0 py-3 px-4 bg-white/95 border-t border-zinc-200 backdrop-blur-md flex justify-around items-center z-40 select-none shrink-0 shadow-lg">
          <button
            type="button"
            onClick={() => setCurrentTab('FRIENDS')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentTab === 'FRIENDS' ? 'text-orange-500 font-bold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Users className="w-5.5 h-5.5 shrink-0" />
            <span className="text-[11px] font-bold">Venner ({friends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('BEST_DAYS')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentTab === 'BEST_DAYS' ? 'text-orange-500 font-bold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Trophy className="w-5.5 h-5.5 shrink-0" />
            <span className="text-[11px] font-bold">Beste dager</span>
          </button>
        </nav>
      )}

      {/* Footer credits - simplified and moved to bottom of content scroll if needed, but here as small discreet text */}
      <footer className="py-6 border-t border-zinc-200 mt-auto shrink-0 select-none bg-white">
        <div className="px-6 flex flex-col items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium text-center">
          <span>Sommerplan 2026 © Planleggingsverktøy for vennegjengen</span>
          <button
            type="button"
            onClick={handleRestoreDemoData}
            className="hover:text-zinc-800 transition-colors cursor-pointer underline underline-offset-2"
          >
            Gjenopprett Demo-data
          </button>
        </div>
      </footer>
    </div>
  );
}