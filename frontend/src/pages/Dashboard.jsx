import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Stethoscope, 
  PawPrint, 
  Filter, 
  Utensils, 
  Pill, 
  Scissors, 
  Bookmark, 
  Plus, 
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { fetchUpcomingTasks, toggleTaskStatus, fetchPets } from '../api/client';

export default function Dashboard({ 
  pets = [], 
  selectedPetFilter, 
  onSelectPetFilter,
  onOpenAddTask, 
  onOpenAddPet,
  refreshStatsTrigger,
  onTasksUpdated 
}) {
  const [tasks, setTasks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch upcoming pending tasks based on selected category & pet filters
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetchUpcomingTasks({
        category: categoryFilter,
        pet: selectedPetFilter,
      });
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load upcoming tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [categoryFilter, selectedPetFilter, refreshStatsTrigger]);

  // Handle task status toggle
  const handleToggleTask = async (taskId) => {
    try {
      setTogglingId(taskId);
      const res = await toggleTaskStatus(taskId);
      if (res.success) {
        // Optimistically remove from pending schedule view or reload
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        if (onTasksUpdated) onTasksUpdated();
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    } finally {
      setTogglingId(null);
    }
  };

  // Compute live summary counter metrics
  const totalPendingCount = tasks.length;
  const vetVisitsCount = tasks.filter((t) => t.category === 'vet').length;
  const registeredPetsCount = pets.length;

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'feeding', label: 'Feeding' },
    { id: 'vet', label: 'Vet Visit' },
    { id: 'medication', label: 'Medication' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'other', label: 'Other' },
  ];

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'feeding':
        return { icon: Utensils, label: 'Feeding', style: 'badge-feeding' };
      case 'vet':
        return { icon: Stethoscope, label: 'Vet Visit', style: 'badge-vet' };
      case 'medication':
        return { icon: Pill, label: 'Medication', style: 'badge-medication' };
      case 'grooming':
        return { icon: Scissors, label: 'Grooming', style: 'badge-grooming' };
      default:
        return { icon: Bookmark, label: 'Other', style: 'badge-other' };
    }
  };

  const formatDueDate = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (isToday) {
      return `Today at ${timeStr}`;
    }
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${timeStr}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border border-orange-200/80 bg-white shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Care Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back to your Pet Care Dashboard 🐾
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
            Keep track of feedings, vet visits, medications, and grooming routines for your pets in real time.
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenAddTask}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Pending Tasks */}
        <div className="p-6 rounded-3xl ui-card flex items-center justify-between border-amber-200/70 hover:border-amber-400">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Pending Tasks
            </p>
            <h3 className="text-3xl sm:text-4xl font-black text-amber-600 font-mono">
              {totalPendingCount}
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center space-x-1">
              <span>Upcoming care routines</span>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 shadow-sm">
            <Clock className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>

        {/* Metric 2: Vet Visits */}
        <div className="p-6 rounded-3xl ui-card flex items-center justify-between border-rose-200/70 hover:border-rose-400">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Vet Visits Scheduled
            </p>
            <h3 className="text-3xl sm:text-4xl font-black text-rose-600 font-mono">
              {vetVisitsCount}
            </h3>
            <p className="text-[11px] text-rose-700 font-semibold mt-1">
              Medical & health checkups
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shadow-sm">
            <Stethoscope className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>

        {/* Metric 3: Registered Pets */}
        <div className="p-6 rounded-3xl ui-card flex items-center justify-between border-emerald-200/70 hover:border-emerald-400">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Registered Pets
            </p>
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">
              {registeredPetsCount}
            </h3>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Active companions
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
            <PawPrint className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Quick Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl ui-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Dropdown */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4 text-orange-500" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-white text-slate-800 font-medium">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile/Quick Pet Radio Selection Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider shrink-0">
            Filter Pet:
          </span>
          <button
            onClick={() => onSelectPetFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPetFilter === 'all'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            All Pets
          </button>
          {pets.map((p) => (
            <button
              key={p._id}
              onClick={() => onSelectPetFilter(p._id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedPetFilter === p._id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-orange-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Task Schedule List */}
      <div className="p-6 sm:p-7 rounded-3xl ui-panel space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-orange-500" />
              <span>Upcoming Care Schedule</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Check off tasks as you complete them to automatically recalculate pending stats.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-mono">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} pending
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading upcoming schedule...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-orange-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">No Pending Tasks Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                {selectedPetFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No upcoming tasks match your current pet or category filters.'
                  : 'Great job! All pet care tasks are completed. Click "Schedule Task" to add a new task.'}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              {pets.length === 0 ? (
                <button
                  onClick={onOpenAddPet}
                  className="btn-primary"
                >
                  Add Your First Pet
                </button>
              ) : (
                <button
                  onClick={onOpenAddTask}
                  className="btn-primary"
                >
                  + Schedule New Task
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const badge = getCategoryBadge(task.category);
              const CategoryIcon = badge.icon;
              const isToggling = togglingId === task._id;

              return (
                <div
                  key={task._id}
                  className={`p-4 rounded-2xl ui-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all ${
                    isToggling ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Interactive Checkbox */}
                    <button
                      onClick={() => handleToggleTask(task._id)}
                      title="Click to mark as completed"
                      className="mt-0.5 w-5 h-5 rounded-lg border-2 border-slate-300 bg-white hover:border-orange-500 hover:bg-orange-50 flex items-center justify-center text-transparent hover:text-orange-500 transition-all shrink-0 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">
                          {task.title}
                        </h4>
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.style}`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {task.pet && (
                          <div className="flex items-center space-x-1 text-orange-600 font-semibold">
                            <PawPrint className="w-3.5 h-3.5 text-orange-500" />
                            <span>{task.pet.name} ({task.pet.species})</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{formatDueDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Action Pill */}
                  <div className="flex items-center justify-end sm:justify-center">
                    <button
                      onClick={() => handleToggleTask(task._id)}
                      className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-emerald-50 border border-orange-200 hover:border-emerald-300 text-orange-700 hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Complete Task ✓
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
