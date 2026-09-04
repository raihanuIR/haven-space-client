import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { loginWithGoogleFirebase } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount without redirecting to login on reload
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('rental_token');
      const savedUser = localStorage.getItem('rental_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        try {
          // Verify with backend to get latest user details
          const { data } = await API.get('/auth/me');
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('rental_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('[Session Verification Note]: Using cached credentials', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('rental_token', data.token);
        localStorage.setItem('rental_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('rental_token', data.token);
        localStorage.setItem('rental_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const googleData = await loginWithGoogleFirebase();
      const { data } = await API.post('/auth/google', googleData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('rental_token', data.token);
        localStorage.setItem('rental_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Google login failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rental_token');
    localStorage.removeItem('rental_user');
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('rental_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
