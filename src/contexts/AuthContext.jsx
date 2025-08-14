import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserRole, getUserRoles, setUserRole as setUserRoleUtil, setUserRoles as setUserRolesUtil, clearUserData, isInstructorOrAdmin as checkInstructorOrAdmin, logoutUser } from '@/services/userService';
import { setupTokenRefresh, clearTokenRefresh, saveLoginTime, isAuthenticated } from '@/services/tokenService';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRoleState] = useState('user');
  const [userRoles, setUserRolesState] = useState(['user']);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
      
      if (authStatus) {
        const role = getUserRole();
        const roles = getUserRoles();
        setUserRoleState(role);
        setUserRolesState(roles);
        
        setupTokenRefresh(
          () => {
            console.log('Token refresh successful');
          },
          (error) => {
            console.error('Token refresh failed:', error);
            logout();
          }
        );
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    return () => {
      clearTokenRefresh();
    };
  }, []);

  const setAuth = useCallback((token) => {
    if (token) {
      localStorage.setItem('token', token);
      saveLoginTime();
      setIsAuth(true);
    } else {
      clearTokenRefresh();
      localStorage.removeItem('token');
      setIsAuth(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await axios.post('https://creditor-backend-1-iijy.onrender.com/api/auth/login', credentials, {
        withCredentials: true
      });
      
      if (response.data.accessToken) {
        setAuth(response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, [setAuth]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearUserData();
      clearTokenRefresh();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      Cookies.remove('token');
      Cookies.remove('userId');
      
      setUserRoleState('user');
      setUserRolesState(['user']);
      setIsAuth(false);
      
      window.dispatchEvent(new Event('userRoleChanged'));
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      window.location.href = '/login';
    }
  }, []);

  const value = {
    userRole,
    userRoles,
    isAuthenticated: isAuth,
    isLoading,
    login,
    logout,
    setAuth,
    isInstructorOrAdmin: checkInstructorOrAdmin,
    hasRole: (role) => userRoles.includes(role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};