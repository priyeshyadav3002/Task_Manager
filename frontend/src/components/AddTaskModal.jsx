import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, userId }) => {
  const today = new Date().toISOString().split('T')[0];
  const [users, setUsers] = useState([]);
  
  // Flat states to prevent object merging bugs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(today);
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5001/api/users')
        .then(res => res.json())
        .then(data => setUsers(data ?? []));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignedTo) {
      toast.error("Please select a team member!");
      return;
    }

    const payload = {
      title,
      description,
      priority,
      dueDate,
      status: 'Pending',
      creatorId: userId,
      assignedTo: String(assignedTo) // CRITICAL: This links the task to the user
    };

    const res = await fetch('http://localhost:5001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Task Assigned!");
      onTaskAdded();
      onClose();
      // Reset fields
      setTitle(''); setDescription(''); setAssignedTo('');
    }
  };

  return (
    /* Changed bg-black/80 to a softer light-tinted overlay with heavy blur */
    <div className="fixed inset-0 z-[70] bg-rose-900/10 flex items-center justify-center p-4 backdrop-blur-md">
      {/* Changed bg-slate-900 to Pure White and updated borders to Rose-100 */}
      <div className="bg-white border border-rose-100 w-full max-w-md p-10 rounded-[3rem] shadow-2xl shadow-rose-200/40">
        <header className="flex justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Assignment</h2>
          <button onClick={onClose} className="text-rose-300 hover:text-rose-500 transition-colors">
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inputs: Swapped bg-slate-950 for bg-slate-50 and indigo focus for rose */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-rose-400 uppercase ml-2 tracking-widest">Task Title</label>
            <input 
              required 
              placeholder="What needs to be done?" 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-rose-400 uppercase ml-2 tracking-widest">Details</label>
            <textarea 
              placeholder="Add some helpful context..." 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all h-28 font-medium" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-rose-400 uppercase ml-2 tracking-widest">Assign To</label>
            <select 
              required 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 appearance-none cursor-pointer font-medium" 
              value={assignedTo} 
              onChange={e => setAssignedTo(e.target.value)}
            >
              <option value="">Select a team member...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[10px] font-black text-rose-400 uppercase ml-2 tracking-widest">Priority</label>
               <select 
                 className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 appearance-none cursor-pointer font-medium" 
                 value={priority} 
                 onChange={e => setPriority(e.target.value)}
               >
                 <option value="Low">Low</option>
                 <option value="Medium">Medium</option>
                 <option value="High">High</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-rose-400 uppercase ml-2 tracking-widest">Deadline</label>
               <input 
                 type="date" 
                 min={today} 
                 required 
                 className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 font-medium" 
                 value={dueDate} 
                 onChange={e => setDueDate(e.target.value)} 
               />
             </div>
          </div>

          {/* Button: Swapped indigo for Vibrant Rose with heavy shadow */}
          <button 
            type="submit" 
            className="w-full bg-rose-500 hover:bg-rose-600 py-4 rounded-2xl text-white font-black text-lg shadow-lg shadow-rose-500/30 transition-all active:scale-95 mt-4"
          >
            Deploy Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;