import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        // SAFE PARSING: Prevents white screen if localStorage is corrupted
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("AuthContext: Failed to parse user data", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    // Optional: Force a refresh to clear all app states
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* LOADING GUARD: Prevents rendering components (like Sidebar/Dashboard) 
          before the user state is actually determined. */}
      {!loading ? children : (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-indigo-400 font-medium animate-pulse">
            Initializing Workspace...
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};