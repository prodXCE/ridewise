import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rw_token'));

  useEffect(() => {
    // Restore session on refresh
    const storedUser = localStorage.getItem('rw_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      // Save session
      localStorage.setItem('rw_token', data.token);
      localStorage.setItem('rw_user', JSON.stringify({ username: data.username }));
      setToken(data.token);
      setUser({ username: data.username });
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  };

  const register = async (username, password) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Registration failed');
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('rw_token');
    localStorage.removeItem('rw_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
