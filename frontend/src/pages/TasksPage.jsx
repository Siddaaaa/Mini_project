import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Stethoscope, 
  Pill, 
  Scissors, 
  Bookmark, 
  PawPrint,
  Check,
  X
} from 'lucide-react';
import { fetchTasks, toggleTaskStatus, deleteTask } from '../api/client';

export default function TasksPage({ pets = [], onOpenAddTask, onTasksUpdated, refreshStatsTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [petFilter, setPetFilter] = useState('all');
  const [actionId, setActionId] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchTasks({
        status: statusFilter,
        category: categoryFilter,
        pet: petFilter,
      });
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter, categoryFilter, petFilter, refreshStatsTrigger]);

  const handleToggle = async (id) => {
    try {
      setActionId(id);
      const res = await toggleTaskStatus(id);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: res.data.status } : t))
        );
        if (onTasksUpdated) onTasksUpdated();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionId(id);
      const res = await deleteTask(id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        if (onTasksUpdated) onTasksUpdated();
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setActionId(null);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'feeding':
        return { icon: Utensils, label: 'Feeding', style: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'vet':
        return { icon: Stethoscope, label: 'Vet Visit', style: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'medication':
        return { icon: Pill, label: 'Medication', style: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'grooming':
        return { icon: Scissors, label: 'Grooming', style: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
      default:
        return { icon: Bookmark, label: 'Other', style: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Task Directory</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            All Care Tasks ({tasks.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View completed and pending tasks, update status, and manage schedules.
          </p>
        </div>
        <button
          onClick={onOpenAddTask}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl glass-panel grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Statuses</option>
            <option value="pending" className="bg-slate-900">Pending Only</option>
            <option value="completed" className="bg-slate-900">Completed Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Category Filter
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Categories</option>
            <option value="feeding" className="bg-slate-900">Feeding</option>
            <option value="vet" className="bg-slate-900">Vet Visit</option>
            <option value="medication" className="bg-slate-900">Medication</option>
            <option value="grooming" className="bg-slate-900">Grooming</option>
            <option value="other" className="bg-slate-900">Other</option>
          </select>
        </div>

        {/* Pet Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Pet Filter
          </label>
          <select
            value={petFilter}
            onChange={(e) => setPetFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Pets</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id} className="bg-slate-900">
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabular View */}
      <div className="rounded-3xl glass-panel overflow-hidden border border-slate-800">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Loading task records...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No Tasks Matching Filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your status, category, or pet filters above to see more records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Task Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Assigned Pet</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((task) => {
                  const badge = getCategoryBadge(task.category);
                  const CategoryIcon = badge.icon;
                  const isCompleted = task.status === 'completed';
                  const isActioning = actionId === task._id;

                  return (
                    <tr
                      key={task._id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCompleted ? 'bg-slate-900/30' : ''
                      } ${isActioning ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {/* Status Toggle Cell */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggle(task._id)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 font-semibold text-slate-100 max-w-xs truncate">
                        <span className={isCompleted ? 'line-through text-slate-400' : ''}>
                          {task.title}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.style}`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Pet Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {task.pet ? (
                          <div className="flex items-center space-x-1.5 text-teal-300 font-medium">
                            <PawPrint className="w-3.5 h-3.5 text-teal-400" />
                            <span>{task.pet.name}</span>
                            <span className="text-[10px] text-slate-500">({task.pet.species})</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                        {formatDate(task.dueDate)}
                      </td>

                      {/* Action Cell */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleToggle(task._id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 transition-all cursor-pointer inline-flex items-center"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
