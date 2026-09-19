import React, { useState } from 'react';
import { X, PawPrint, Check } from 'lucide-react';
import { createPet } from '../api/client';

export default function AddPetModal({ isOpen, onClose, onPetAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.species.trim()) {
      setError('Please provide pet name and species.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await createPet({
        name: formData.name.trim(),
        species: formData.species.trim(),
        breed: formData.breed.trim() || 'Unknown',
        age: formData.age ? Number(formData.age) : 0,
      });

      if (response.success) {
        onPetAdded(response.data);
        setFormData({ name: '', species: 'Dog', breed: '', age: '' });
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 shadow-2xl border border-slate-700/60 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Add New Pet</h3>
              <p className="text-xs text-slate-400">Register a new companion to your profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Pet Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Milo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm placeholder-slate-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Species *
              </label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm transition-all"
              >
                {speciesOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Age (years)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 3"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Breed
            </label>
            <input
              type="text"
              placeholder="e.g. Golden Retriever"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm placeholder-slate-500 transition-all"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Register Pet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
