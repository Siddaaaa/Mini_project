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
    { id: 'feeding', label: 'Feeding', icon: Utensils, color: 'text-amber-700 bg-amber-100 border-amber-300 ring-2 ring-amber-400' },
    { id: 'vet', label: 'Vet Visit', icon: Stethoscope, color: 'text-rose-700 bg-rose-100 border-rose-300 ring-2 ring-rose-400' },
    { id: 'medication', label: 'Medication', icon: Pill, color: 'text-purple-700 bg-purple-100 border-purple-300 ring-2 ring-purple-400' },
    { id: 'grooming', label: 'Grooming', icon: Scissors, color: 'text-sky-700 bg-sky-100 border-sky-300 ring-2 ring-sky-400' },
    { id: 'other', label: 'Other', icon: Bookmark, color: 'text-emerald-700 bg-emerald-100 border-emerald-300 ring-2 ring-emerald-400' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Schedule Task</h3>
              <p className="text-xs text-slate-500 font-medium">Assign a care duty or reminder to a pet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Pet *
            </label>
            <select
              required
              value={formData.pet}
              onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-orange-500 text-slate-900 text-sm transition-all shadow-sm"
            >
              {pets.length === 0 ? (
                <option value="">No pets registered yet - please add a pet first</option>
              ) : (
                pets.map((p) => (
                  <option key={p._id} value={p._id} className="bg-white text-slate-900">
                    {p.name} ({p.species} - {p.breed})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning kibble & fresh water"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-orange-500 text-slate-900 text-sm placeholder-slate-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {categoryIcons.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${cat.color} scale-[1.03] shadow-sm`
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300'
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-orange-500 text-slate-900 text-sm transition-all shadow-sm"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pets.length === 0}
              className="btn-primary"
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
