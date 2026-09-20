import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AddPetModal from './components/AddPetModal';
import AddTaskModal from './components/AddTaskModal';
import Dashboard from './pages/Dashboard';
import PetsPage from './pages/PetsPage';
import TasksPage from './pages/TasksPage';
import { fetchPets } from './api/client';
import { LayoutDashboard, HeartHandshake, CheckSquare } from 'lucide-react';
import './App.css';

export default function App() {
  const [pets, setPets] = useState([]);
  const [selectedPetFilter, setSelectedPetFilter] = useState('all');
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [refreshStatsTrigger, setRefreshStatsTrigger] = useState(0);

  // Load pets and task counts app-wide
  const loadPets = async () => {
    try {
      const res = await fetchPets();
      if (res.success) {
        setPets(res.data);
      }
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  };

  useEffect(() => {
    loadPets();
  }, [refreshStatsTrigger]);

  const handlePetAdded = (newPet) => {
    setPets((prev) => [newPet, ...prev]);
    setRefreshStatsTrigger((prev) => prev + 1);
  };

  const handlePetDeleted = (deletedPetId) => {
    setPets((prev) => prev.filter((p) => p._id !== deletedPetId));
    if (selectedPetFilter === deletedPetId) {
      setSelectedPetFilter('all');
    }
    setRefreshStatsTrigger((prev) => prev + 1);
  };

  const handleTaskAdded = () => {
    setRefreshStatsTrigger((prev) => prev + 1);
  };

  const handleTasksUpdated = () => {
    setRefreshStatsTrigger((prev) => prev + 1);
  };

  // Calculate total pending tasks across all pets for Header badge
  const totalPendingTasksCount = pets.reduce((acc, pet) => acc + (pet.pendingTaskCount || 0), 0);

  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col font-sans">
        {/* Top Header */}
        <Header
          onOpenAddPet={() => setIsAddPetOpen(true)}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          petCount={pets.length}
          pendingTaskCount={totalPendingTasksCount}
        />

        {/* Main Application Body with Sidebar */}
        <div className="app-main-wrapper flex-1 flex overflow-hidden">
          {/* Sidebar Navigation & Filters */}
          <Sidebar
            pets={pets}
            selectedPetFilter={selectedPetFilter}
            onSelectPetFilter={setSelectedPetFilter}
          />

          {/* Main Workspace Content Area */}
          <main className="app-main-content flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    pets={pets}
                    selectedPetFilter={selectedPetFilter}
                    onSelectPetFilter={setSelectedPetFilter}
                    onOpenAddPet={() => setIsAddPetOpen(true)}
                    onOpenAddTask={() => setIsAddTaskOpen(true)}
                    refreshStatsTrigger={refreshStatsTrigger}
                    onTasksUpdated={handleTasksUpdated}
                  />
                }
              />
              <Route
                path="/pets"
                element={
                  <PetsPage
                    pets={pets}
                    onOpenAddPet={() => setIsAddPetOpen(true)}
                    onPetDeleted={handlePetDeleted}
                  />
                }
              />
              <Route
                path="/tasks"
                element={
                  <TasksPage
                    pets={pets}
                    onOpenAddTask={() => setIsAddTaskOpen(true)}
                    onTasksUpdated={handleTasksUpdated}
                    refreshStatsTrigger={refreshStatsTrigger}
                  />
                }
              />
            </Routes>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around py-2.5 shadow-lg">
          <Link
            to="/"
            className="flex flex-col items-center text-[10px] text-slate-600 hover:text-orange-600 font-bold transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5 text-orange-500" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/pets"
            className="flex flex-col items-center text-[10px] text-slate-600 hover:text-orange-600 font-bold transition-colors"
          >
            <HeartHandshake className="w-5 h-5 mb-0.5 text-rose-500" />
            <span>Pets</span>
          </Link>
          <Link
            to="/tasks"
            className="flex flex-col items-center text-[10px] text-slate-600 hover:text-orange-600 font-bold transition-colors"
          >
            <CheckSquare className="w-5 h-5 mb-0.5 text-emerald-500" />
            <span>Tasks</span>
          </Link>
        </nav>

        {/* Global Action Modals */}
        <AddPetModal
          isOpen={isAddPetOpen}
          onClose={() => setIsAddPetOpen(false)}
          onPetAdded={handlePetAdded}
        />
        <AddTaskModal
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          pets={pets}
          onTaskAdded={handleTaskAdded}
          preselectedPetId={selectedPetFilter}
        />
      </div>
    </Router>
  );
}
