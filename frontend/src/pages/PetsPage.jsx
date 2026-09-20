import React, { useState } from 'react';
import { PawPrint, Trash2, Plus, AlertCircle, HeartHandshake } from 'lucide-react';
import { deletePet } from '../api/client';

export default function PetsPage({ pets = [], onOpenAddPet, onPetDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmPetId, setConfirmPetId] = useState(null);
  const [error, setError] = useState('');

  const handleDelete = async (petId) => {
    try {
      setDeletingId(petId);
      setError('');
      const res = await deletePet(petId);
      if (res.success) {
        onPetDeleted(petId);
        setConfirmPetId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete pet');
    } finally {
      setDeletingId(null);
    }
  };

  const getSpeciesTheme = (species = '') => {
    const s = species.toLowerCase();
    if (s.includes('dog')) {
      return { emoji: '🐶', gradient: 'from-amber-500 to-orange-500', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    }
    if (s.includes('cat')) {
      return { emoji: '🐱', gradient: 'from-purple-500 to-indigo-500', text: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
    }
    if (s.includes('bird')) {
      return { emoji: '🐦', gradient: 'from-sky-500 to-blue-500', text: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' };
    }
    if (s.includes('rabbit') || s.includes('bunny')) {
      return { emoji: '🐰', gradient: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    }
    return { emoji: '🐾', gradient: 'from-teal-500 to-emerald-500', text: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' };
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl ui-panel">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Pet Profiles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Registered Pets ({pets.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage your pets and view pending tasks associated with each profile.
          </p>
        </div>
        <button
          onClick={onOpenAddPet}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Pet</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Pet Cards Grid */}
      {pets.length === 0 ? (
        <div className="py-20 text-center ui-panel rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-orange-500">
            <PawPrint className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Pets Registered Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              Add your dogs, cats, rabbits, or birds to start tracking their daily tasks and care schedules.
            </p>
          </div>
          <button
            onClick={onOpenAddPet}
            className="btn-primary"
          >
            + Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => {
            const theme = getSpeciesTheme(pet.species);
            const initials = pet.name ? pet.name.slice(0, 2).toUpperCase() : 'PT';
            const isDeleting = deletingId === pet._id;
            const isConfirming = confirmPetId === pet._id;

            return (
              <div
                key={pet._id}
                className="relative rounded-3xl ui-card p-6 flex flex-col justify-between space-y-5 border border-slate-200 hover:border-orange-300 transition-all group"
              >
                {/* Header Info & Avatar */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    {/* Avatar Initials Badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-orange-500/20 font-mono`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                        <span>{pet.name}</span>
                        <span className="text-base">{theme.emoji}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {pet.breed || 'Unknown Breed'}
                      </p>
                    </div>
                  </div>

                  {/* Pending Tasks Count Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                      pet.pendingTaskCount > 0
                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {pet.pendingTaskCount} pending
                  </span>
                </div>

                {/* Details Meta Table */}
                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Species
                    </span>
                    <span className="font-bold text-slate-800">{pet.species}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Age
                    </span>
                    <span className="font-bold text-slate-800">
                      {pet.age !== undefined && pet.age !== null ? `${pet.age} yrs` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Delete Confirmation or Delete Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Added {new Date(pet.createdAt).toLocaleDateString()}
                  </span>

                  {isConfirming ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-rose-600 font-bold">Delete & tasks?</span>
                      <button
                        onClick={() => handleDelete(pet._id)}
                        disabled={isDeleting}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmPetId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-all cursor-pointer border border-slate-200"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmPetId(pet._id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
