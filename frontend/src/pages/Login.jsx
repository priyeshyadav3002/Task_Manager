import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 1) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const toastId = toast.loading('Authenticating...');
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        toast.success('Access granted. Redirecting...', { id: toastId });
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Invalid email or password', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error. Ensure backend is running on port 5001', { id: toastId });
    }
  };

  return (
    /* Change: bg-slate-950 -> Bright Sunrise Gradient */
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          {/* Change: indigo colors -> Warm Rose palette */}
          <div className="w-16 h-16 bg-rose-500 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-xl shadow-rose-200">
            <Command className="text-white w-8 h-8" />
          </div>
          {/* Change: white text -> Deep Slate Ink text */}
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Welcome back</h2>
          <p className="text-slate-400 mt-2 font-medium">Warm to see you again.</p>
        </div>

        {/* Change: bg-slate-900/50 -> Pure White organic card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white p-10 shadow-2xl shadow-rose-200/40">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              {/* Change: text-slate-500 -> text-rose-300 */}
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              {/* Change: bg-slate-950/50 -> bg-slate-50, border-slate-800 -> border-slate-100 */}
              <input 
                type="email" 
                required 
                className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input 
                type="password" 
                required 
                className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {/* Change: bg-indigo-600 -> Vibrant Rose-500 */}
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-rose-500/30 text-lg transition-all"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Change: border-slate-800 -> border-rose-50 */}
          <div className="mt-8 text-center border-t border-rose-50 pt-8">
            <p className="text-sm text-slate-500 font-medium">
              New to TaskQuest? <Link to="/signup" className="text-rose-500 font-black hover:underline ml-1">Create an account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;