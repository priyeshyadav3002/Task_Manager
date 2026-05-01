import { API_BASE_URL } from '../config';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Member');
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const toastId = toast.loading('Creating your workspace...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();

      if (response.ok) {
        toast.success('Account created! Please sign in.', { id: toastId });
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed', { id: toastId });
      }
    } catch (error) {
      // Updated error message to be relevant for live cloud deployment
      toast.error('Network error. Ensure your backend is live on Render', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-rose-500 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-xl shadow-rose-200">
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Create account</h2>
          <p className="text-slate-400 mt-2 font-medium">Join us and start organizing.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white p-10 shadow-2xl shadow-rose-200/40">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input type="text" required className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input type="email" required className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input type="password" required className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="Password (min. 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input type="password" required className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <select className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none appearance-none cursor-pointer" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Member">Project Member</option>
                <option value="Admin">Project Manager (Admin)</option>
              </select>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-rose-500/30 text-lg transition-all mt-4">
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-rose-50 pt-8">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-rose-500 font-black hover:underline ml-1">Sign in here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;