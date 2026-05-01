import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { CheckSquare, Calendar, Bookmark } from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/tasks').then(res => res.json()).then(data => {
      const filtered = (data ?? []).filter(t => 
        String(t.assignedTo) === String(user?.id) || t.creatorId === user?.id
      );
      setList(filtered);
    });
  }, [user?.id]);

  return (
    /* Changed bg-slate-950 to Bright Human Pattern white */
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans text-slate-900">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      {/* Main content with dynamic margin and bright typography */}
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-20'}`}>
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tight">
            <CheckSquare className="text-rose-500 w-10 h-10" /> Task Repository
          </h1>
          <p className="text-slate-400 mt-2 font-medium">A complete history of your workspace contributions.</p>
        </header>

        <div className="space-y-6">
          {list.length > 0 ? list.map(t => (
            /* Changed bg-slate-900 to Pure White organic cards with rose-tinted shadows */
            <div 
              key={t.id} 
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex justify-between items-center hover:shadow-2xl hover:shadow-rose-200/20 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                  <Bookmark size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg tracking-tight">{t.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-50 px-2 py-1 rounded-lg">
                      {t.status}
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                      {t.priority || 'Normal'} Priority
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-rose-300">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Deadline</span>
                </div>
                <span className="text-slate-800 font-black text-sm">{t.dueDate}</span>
              </div>
            </div>
          )) : (
            <div className="py-32 text-center border-2 border-dashed border-rose-100 rounded-[3rem] bg-rose-50/10">
              <p className="text-rose-300 font-bold italic">No assignments archived in your repository yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;