import { API_BASE_URL } from '../config';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, CheckCircle2, Zap, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Use MongoDB _id primarily
  const currentUserId = user?._id || user?.id;

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      const data = await response.json();
      setTasks(data ?? []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, userId: currentUserId }),
    });
    if (res.ok) { fetchTasks(); toast.success(`Task ${newStatus}`); }
  };

  const displayTasks = (tasks ?? []).filter(t => {
    if (user?.role === 'Admin') return true; 

    // CRITICAL FIX: 
    // Since assignedTo is POPULATED, t.assignedTo is an object { _id: "...", name: "..." }
    // We must check for ._id first, then fallback to the string.
    const taskAssignedId = t.assignedTo?._id || t.assignedTo;
    
    return String(taskAssignedId) === String(currentUserId);
  });

  const activeTasks = displayTasks.filter(t => t.status !== 'Completed');

  const themeText = user?.role === 'Admin' ? 'text-rose-500' : 'text-teal-600';
  const themeBtn = user?.role === 'Admin' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-500 hover:bg-teal-600';
  const themeBg = user?.role === 'Admin' ? 'bg-rose-50' : 'bg-teal-50';

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans text-slate-900">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-20'}`}>
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Workspace</h1>
            <p className="text-slate-400 mt-2 font-medium">Welcome back, <span className={`${themeText} font-bold`}>{user?.name}</span></p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 relative hover:shadow-md transition-all shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {displayTasks.some(t => t.status === 'Pending') && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-72 bg-white border border-rose-100 rounded-[2rem] shadow-2xl shadow-rose-200/20 z-50 p-6"
                  >
                    <h3 className="text-slate-400 font-black text-[10px] mb-4 uppercase tracking-widest">Alerts</h3>
                    <div className="space-y-3">
                      {displayTasks.filter(t => t.status === 'Pending').slice(-3).map(t => (
                        <div key={t._id} className="text-xs text-slate-600 border-b border-rose-50 pb-2">
                          New assignment: <span className="text-rose-500 font-bold">"{t.title}"</span>
                        </div>
                      ))}
                      {displayTasks.filter(t => t.status === 'Pending').length === 0 && (
                        <p className="text-[10px] text-slate-400 italic font-medium">No new alerts.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user?.role === 'Admin' && (
              <button onClick={() => setIsModalOpen(true)} className={`${themeBtn} text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-rose-200 transition-all active:scale-95`}>
                <Plus className="w-5 h-5" /> New Task
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] shadow-sm">
            <Clock className="text-amber-500 w-6 h-6 mb-4" />
            <p className="text-amber-700/60 text-[10px] font-black uppercase tracking-widest">Pending</p>
            <p className="text-4xl text-amber-900 font-black mt-1">{displayTasks.filter(t => t.status === 'Pending').length}</p>
          </div>
          <div className={`${themeBg} border border-rose-100 p-8 rounded-[2.5rem] shadow-sm`}>
            <Zap className={`${themeText} w-6 h-6 mb-4`} />
            <p className={`${themeText} opacity-60 text-[10px] font-black uppercase tracking-widest`}>Accepted</p>
            <p className={`text-4xl ${themeText} font-black mt-1`}>{displayTasks.filter(t => t.status === 'Accepted').length}</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 p-8 rounded-[2.5rem] shadow-sm">
            <CheckCircle2 className="text-sky-500 w-6 h-6 mb-4" />
            <p className="text-sky-700/60 text-[10px] font-black uppercase tracking-widest">Active Total</p>
            <p className="text-4xl text-sky-900 font-black mt-1">{activeTasks.length}</p>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-slate-800 text-xl font-black mb-6 tracking-tight">Current Assignments</h2>
          {activeTasks.length > 0 ? activeTasks.slice(-5).reverse().map((task) => (
            <div key={task._id} className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] group hover:shadow-xl hover:shadow-rose-200/10 transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-3 h-3 rounded-full ${task.priority === 'High' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'bg-emerald-400'}`} />
                <div>
                  <h3 className="text-slate-800 font-bold text-lg">{task.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 font-medium">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {task.status === 'Pending' && user?.role === 'Member' && (
                  <button onClick={() => handleUpdateStatus(task._id, 'Accepted')} className="bg-teal-50 text-teal-600 border border-teal-100 px-6 py-2 rounded-xl text-xs font-black hover:bg-teal-500 hover:text-white transition-all">Accept</button>
                )}
                {task.status === 'Accepted' && (
                  <button onClick={() => handleUpdateStatus(task._id, 'Completed')} className={`${themeBtn} text-white px-6 py-2 rounded-xl text-xs font-black transition-all`}>Complete</button>
                )}
                <span className="text-[10px] font-black px-4 py-2 rounded-xl bg-slate-50 text-slate-400 uppercase tracking-widest border border-slate-100 font-mono">{task.status}</span>
              </div>
            </div>
          )) : <div className="py-20 text-center border-2 border-dashed border-rose-100 rounded-[3rem] bg-rose-50/20">
              <p className="text-rose-300 font-bold italic tracking-wide">No assignments found for today.</p>
            </div>}
        </div>
      </main>
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskAdded={fetchTasks} userId={currentUserId} />
    </div>
  );
};

export default Dashboard;