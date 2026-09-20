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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl ui-panel">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Task Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            All Care Tasks ({tasks.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            View completed and pending tasks, update status, and manage schedules.
          </p>
        </div>
        <button
          onClick={onOpenAddTask}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 sm:p-6 rounded-2xl ui-panel grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Category Filter
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">All Categories</option>
            <option value="feeding">Feeding</option>
            <option value="vet">Vet Visit</option>
            <option value="medication">Medication</option>
            <option value="grooming">Grooming</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Pet Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pet Filter
          </label>
          <select
            value={petFilter}
            onChange={(e) => setPetFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">All Pets</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabular View */}
      <div className="app-table-container">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading task records...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Tasks Matching Filters</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Try adjusting your status, category, or pet filters above to see more records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Task Title</th>
                  <th>Category</th>
                  <th>Assigned Pet</th>
                  <th>Due Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const badge = getCategoryBadge(task.category);
                  const CategoryIcon = badge.icon;
                  const isCompleted = task.status === 'completed';
                  const isActioning = actionId === task._id;

                  return (
                    <tr
                      key={task._id}
                      className={isActioning ? 'opacity-50 pointer-events-none' : ''}
                    >
                      {/* Status Toggle Cell */}
                      <td className="whitespace-nowrap">
                        <button
                          onClick={() => handleToggle(task._id)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isCompleted
                              ? 'status-pill-completed'
                              : 'status-pill-pending'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Title */}
                      <td className="font-bold text-slate-900 max-w-xs truncate">
                        <span className={isCompleted ? 'line-through text-slate-400 font-normal' : ''}>
                          {task.title}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.style}`}
                        >
                          <CategoryIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Pet Info */}
                      <td className="whitespace-nowrap">
                        {task.pet ? (
                          <div className="flex items-center space-x-1.5 text-orange-600 font-bold">
                            <PawPrint className="w-3.5 h-3.5 text-orange-500" />
                            <span>{task.pet.name}</span>
                            <span className="text-[11px] text-slate-500 font-medium">({task.pet.species})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Unassigned</span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="whitespace-nowrap text-slate-600 font-medium text-xs">
                        {formatDate(task.dueDate)}
                      </td>

                      {/* Action Cell */}
                      <td className="whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleToggle(task._id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-bold transition-all cursor-pointer border border-slate-200"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer inline-flex items-center shadow-sm"
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
