import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Fetches live users from the MongoDB-connected backend
    fetch('http://localhost:5001/api/users')
      .then(res => res.json())
      .then(data => setMembers(data ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans text-slate-900">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-20'}`}>
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 tracking-tight">
            <Users className="text-rose-500 w-10 h-10" /> Team Performance
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Real-time workload distribution across your active members.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <motion.div
              /* Updated key to use MongoDB _id */
              key={member._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-100 p-8 rounded-[2.5rem] group hover:shadow-2xl hover:shadow-rose-200/20 transition-all"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-inner ${
                  member.role === 'Admin' ? 'bg-rose-50 text-rose-500' : 'bg-teal-50 text-teal-600'
                }`}>
                  {member.name?.charAt(0)}
                </div>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border ${
                  member.role === 'Admin' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-teal-50 text-teal-600 border-teal-100'
                }`}>
                  {member.role}
                </span>
              </div>

              <h3 className="text-slate-800 font-black text-xl tracking-tight">{member.name}</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">{member.email}</p>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Briefcase className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Tasks</span>
                </div>
                <span className="text-3xl font-black text-slate-800 tracking-tighter">
                   {member.taskCount || 0}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Team;