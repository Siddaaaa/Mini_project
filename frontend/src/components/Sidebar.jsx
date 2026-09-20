import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HeartHandshake, CheckSquare, Filter, PawPrint } from 'lucide-react';

export default function Sidebar({ pets = [], selectedPetFilter, onSelectPetFilter }) {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'My Pets', path: '/pets', icon: HeartHandshake },
    { label: 'All Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const getSpeciesEmoji = (species = '') => {
    const s = species.toLowerCase();
    if (s.includes('dog')) return '🐶';
    if (s.includes('cat')) return '🐱';
    if (s.includes('bird')) return '🐦';
    if (s.includes('rabbit') || s.includes('bunny')) return '🐰';
    return '🐾';
  };

  return (
    <aside className="app-sidebar hidden md:flex">
      <div className="p-4 space-y-6">
        {/* Navigation Links */}
        <div>
          <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Pet Radio Filter */}
        <div className="pt-4 border-t border-slate-200">
          <div className="px-3 flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-orange-500" />
              <span>Pet Filter</span>
            </h2>
            <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
              {pets.length}
            </span>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {/* All Pets Radio Choice */}
            <label
              className={`pet-filter-item ${selectedPetFilter === 'all' ? 'active' : ''}`}
            >
              <div className="flex items-center space-x-2.5">
                <input
                  type="radio"
                  name="sidebarPetFilter"
                  value="all"
                  checked={selectedPetFilter === 'all'}
                  onChange={() => onSelectPetFilter('all')}
                  className="accent-orange-500 w-3.5 h-3.5 cursor-pointer"
                />
                <div className="flex items-center space-x-1.5">
                  <PawPrint className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-semibold">All Pets</span>
                </div>
              </div>
            </label>

            {/* Individual Pet Radio Choices */}
            {pets.map((pet) => (
              <label
                key={pet._id}
                className={`pet-filter-item ${selectedPetFilter === pet._id ? 'active' : ''}`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <input
                    type="radio"
                    name="sidebarPetFilter"
                    value={pet._id}
                    checked={selectedPetFilter === pet._id}
                    onChange={() => onSelectPetFilter(pet._id)}
                    className="accent-orange-500 w-3.5 h-3.5 cursor-pointer shrink-0"
                  />
                  <span className="shrink-0 text-base">{getSpeciesEmoji(pet.species)}</span>
                  <span className="truncate font-semibold">{pet.name}</span>
                </div>
                {pet.pendingTaskCount > 0 && (
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full shrink-0">
                    {pet.pendingTaskCount}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200">
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 shadow-sm">
          <p className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
            <span>Pet Care Tip</span>
            <span>💡</span>
          </p>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Consistent routine care & vet checkups keep your pets healthy and happy!
          </p>
        </div>
      </div>
    </aside>
  );
}
