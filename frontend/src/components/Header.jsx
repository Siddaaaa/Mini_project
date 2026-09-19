import React from 'react';
import { Plus, PawPrint, Calendar, Heart } from 'lucide-react';

export default function Header({ onOpenAddPet, onOpenAddTask, petCount, pendingTaskCount }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="app-header">
      {/* Brand & Mobile Title */}
      <div className="flex items-center space-x-3">
        <div className="brand-badge">
          <PawPrint className="w-6 h-6" />
        </div>
        <div>
          <h1 className="brand-title">
            Pet Care Tracker
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Daily health & task manager
          </p>
        </div>
      </div>

      {/* Center Stats Bar */}
      <div className="hidden lg:flex header-stats-pill">
        <div className="flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span>{currentDate}</span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong className="text-slate-100 font-semibold">{petCount}</strong> Pets Registered
          </span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <div className="flex items-center space-x-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>
            <strong className="text-slate-100 font-semibold">{pendingTaskCount}</strong> Pending Tasks
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenAddPet}
          className="btn-secondary"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Add Pet</span>
        </button>
        <button
          onClick={onOpenAddTask}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
