import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/api/admin/me');
        setAdmin(res.data);
        localStorage.setItem('admin_user', JSON.stringify(res.data));
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (username, password) => {
    const res = await API.post('/api/admin/login', { username, password });
    const { token: jwtToken, admin: adminData } = res.data;
    setToken(jwtToken);
    setAdmin(adminData);
    localStorage.setItem('admin_token', jwtToken);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token && !!admin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
