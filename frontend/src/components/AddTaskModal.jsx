import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Utensils, Stethoscope, Pill, Scissors, Bookmark } from 'lucide-react';
import { createTask } from '../api/client';

export default function AddTaskModal({ isOpen, onClose, pets = [], onTaskAdded, preselectedPetId = '' }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'feeding',
    pet: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Default due date to current local datetime ISO format
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const formattedDate = now.toISOString().slice(0, 16);

      setFormData({
        title: '',
        category: 'feeding',
        pet: preselectedPetId && preselectedPetId !== 'all' ? preselectedPetId : pets[0]?._id || '',
        dueDate: formattedDate,
      });
      setError('');
    }
  }, [isOpen, pets, preselectedPetId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.pet || !formData.dueDate) {
      setError('Please fill in all required fields (title, pet, due date).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await createTask({
        title: formData.title.trim(),
        category: formData.category,
        pet: formData.pet,
        dueDate: new Date(formData.dueDate).toISOString(),
      });

      if (response.success) {
        onTaskAdded(response.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = [
    { id: 'feeding', label: 'Feeding', icon: Utensils, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'vet', label: 'Vet Visit', icon: Stethoscope, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'medication', label: 'Medication', icon: Pill, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'grooming', label: 'Grooming', icon: Scissors, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { id: 'other', label: 'Other', icon: Bookmark, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 shadow-2xl border border-slate-700/60 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Schedule Task</h3>
              <p className="text-xs text-slate-400">Assign a care duty or reminder to a pet</p>
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
              Target Pet *
            </label>
            <select
              required
              value={formData.pet}
              onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm transition-all"
            >
              {pets.length === 0 ? (
                <option value="">No pets registered yet - please add a pet first</option>
              ) : (
                pets.map((p) => (
                  <option key={p._id} value={p._id} className="bg-slate-900 text-slate-100">
                    {p.name} ({p.species} - {p.breed})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning kibble & fresh water"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categoryIcons.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? `${cat.color} font-bold ring-1 ring-teal-400 scale-[1.02]`
                        : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="capitalize text-[11px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Due Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-100 text-sm transition-all"
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
              disabled={loading || pets.length === 0}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{loading ? 'Creating...' : 'Schedule Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
