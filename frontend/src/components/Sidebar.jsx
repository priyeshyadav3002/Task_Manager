import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, CheckSquare, Users, Settings, 
  LogOut, Zap, ChevronLeft, Menu 
} from 'lucide-react';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Human Pattern: Warm Rose for Admin | Soft Teal for Member
  const themeClass = user?.role === 'Admin' ? 'bg-rose-500' : 'bg-teal-500';
  const textClass = user?.role === 'Admin' ? 'text-rose-500' : 'text-teal-600';
  const shadowClass = user?.role === 'Admin' ? 'shadow-rose-200' : 'shadow-teal-200';
  const hoverClass = user?.role === 'Admin' ? 'hover:bg-rose-50 hover:text-rose-600' : 'hover:bg-teal-50 hover:text-teal-600';

  const handleLogout = () => {
    localStorage.clear();
    if (setUser) setUser(null);
    navigate('/login', { replace: true });
    window.location.reload();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.aside 
      animate={{ width: isExpanded ? 256 : 80 }}
      /* Changed bg-slate-900 -> bg-white | border-slate-800 -> border-rose-100 */
      className="bg-white border-r border-rose-100 h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 shadow-[4px_0_24px_rgba(255,192,203,0.1)]"
    >
      <div className="flex items-center justify-between p-6 mb-4">
        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className={`${themeClass} p-2 rounded-xl shadow-lg ${shadowClass}`}>
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight">TaskQuest</span>
          </motion.div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          /* Changed bg-slate-800 -> bg-rose-50 | text-slate-400 -> text-rose-400 */
          className="p-2 rounded-lg bg-rose-50 text-rose-400 hover:text-rose-600 mx-auto transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all group
              ${isActive 
                ? `${themeClass} text-white shadow-lg ${shadowClass}` 
                : `text-slate-400 ${hoverClass}`}
            `}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {isExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.name}</motion.span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-rose-50 mt-auto">
        <div className={`flex items-center gap-3 mb-4 ${!isExpanded && 'justify-center'}`}>
          {/* User Avatar: Warm backgrounds and deep ink text */}
          <div className={`w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center ${textClass} font-black shadow-sm`}>
            {user?.name?.charAt(0)}
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest ${textClass}`}>{user?.role}</p>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-400 font-bold hover:bg-rose-500 hover:text-white transition-all shadow-rose-100"
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};
export default Sidebar;