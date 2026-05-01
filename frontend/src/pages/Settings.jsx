import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, login } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Member');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5001/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role }),
    });
    if (res.ok) {
      const updated = await res.json();
      login(updated, localStorage.getItem('token'));
      toast.success("Profile Updated!");
    }
  };

  return (
    /* Changed bg-slate-950 to Bright Human Pattern white */
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans text-slate-900">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-20'}`}>
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tight">
            <SettingsIcon className="text-rose-500 w-10 h-10" /> Profile Settings
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Manage your personal identity and workspace role.</p>
        </header>

        {/* Form container: Pure White organic card with soft rose shadow */}
        <form 
          onSubmit={handleUpdate} 
          className="max-w-xl bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-2xl shadow-rose-200/20"
        >
          <div className="space-y-2">
            <label className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-1">Full Name</label>
            {/* Input: Light background with rose focus ring */}
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-1">Workspace Role</label>
            {/* Select: Light background with rose focus ring */}
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="Member">Project Member</option>
              <option value="Admin">Project Manager (Admin)</option>
            </select>
          </div>

          {/* Button: Vibrant Rose with soft shadow */}
          <button 
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 shadow-lg shadow-rose-500/30 transition-all active:scale-95 text-lg"
          >
            <Save size={20} /> Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default Settings;