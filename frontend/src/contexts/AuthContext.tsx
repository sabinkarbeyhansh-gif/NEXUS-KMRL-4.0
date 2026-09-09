import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, DepartmentName } from '../types';

interface AuthContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
  setDepartment: (dept: DepartmentName) => void;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
}

const defaultUser: User = {
  id: 'USR-KMRL-001',
  name: 'K. S. Narayanan',
  email: 'ks.narayanan@kochimetro.org',
  role: 'ADMIN',
  department: 'Safety',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('kmrl_role') as UserRole;
    return savedRole ? { ...defaultUser, role: savedRole } : defaultUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const setRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    localStorage.setItem('kmrl_role', role);
  };

  const setDepartment = (department: DepartmentName) => {
    setCurrentUser((prev) => ({ ...prev, department }));
  };

  const login = (role: UserRole = 'ADMIN') => {
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setRole,
        setDepartment,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
