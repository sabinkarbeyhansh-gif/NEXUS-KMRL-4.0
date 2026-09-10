import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DepartmentName } from '../types';

export interface RoleProfile {
  id: string;
  name: string;
  designation: string;
  role: UserRole;
  department: DepartmentName;
  email: string;
  avatarUrl: string;
  badge: string;
  badgeColor: string;
  permissions: string[];
  keyDuties: string;
}

export const KMRL_ROLE_PROFILES: Record<UserRole, RoleProfile> = {
  ADMIN: {
    id: 'USR-KMRL-001',
    name: 'Dr. Manoj Joshi, IAS',
    designation: 'Managing Director & Central Command',
    role: 'ADMIN',
    department: 'Operations',
    email: 'md.central@kochimetro.org',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    badge: 'Managing Director',
    badgeColor: 'bg-cyan-500 text-slate-950',
    permissions: ['ALL', 'SYSTEM_CONFIG', 'AI_PROVIDER_SWITCH', 'PRIORITY_OVERRIDE', 'AUDIT_SEAL'],
    keyDuties: 'Executive governance, emergency commands, AI policy controls & system-wide overrides.',
  },
  MANAGER: {
    id: 'USR-KMRL-002',
    name: 'S. Pradeep Kumar',
    designation: 'Chief Safety Officer & GM Operations',
    role: 'MANAGER',
    department: 'Safety',
    email: 'cso.pradeep@kochimetro.org',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    badge: 'Chief Safety Officer',
    badgeColor: 'bg-amber-500 text-slate-950',
    permissions: ['DISPATCH_TASKS', 'PRIORITY_OVERRIDE', 'APPROVE_EVIDENCE', 'RISK_RADAR'],
    keyDuties: 'Station-wide risk mitigation, field dispatching, priority escalation & fire safety audits.',
  },
  OFFICER: {
    id: 'USR-KMRL-003',
    name: 'Ananya R. Nair',
    designation: 'Senior Traction & Field Electrical Engineer',
    role: 'OFFICER',
    department: 'Engineering',
    email: 'ananya.nair@kochimetro.org',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    badge: 'Field Engineer',
    badgeColor: 'bg-emerald-500 text-slate-950',
    permissions: ['UPLOAD_DOCS', 'COMPLETE_TASKS', 'SUBMIT_EVIDENCE', 'SCAN_DOCUMENTS'],
    keyDuties: 'Track geometry inspection, catenary maintenance, OCR upload & physical evidence submissions.',
  },
  AUDITOR: {
    id: 'USR-KMRL-004',
    name: 'K. Narayanan, IRSE',
    designation: 'CMRS Statutory Rail Safety Inspector',
    role: 'AUDITOR',
    department: 'Legal',
    email: 'auditor.cmrs@kochimetro.org',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    badge: 'CMRS Statutory Inspector',
    badgeColor: 'bg-purple-500 text-white',
    permissions: ['INSPECT_AUDIT', 'POLICY_CONFLICT', 'COMPLIANCE_REPORTS', 'EXPORT_LOGS'],
    keyDuties: 'Statutory compliance verification, immutable audit trail tracking & policy conflict detection.',
  },
  VIEWER: {
    id: 'USR-KMRL-005',
    name: 'Meera Krishnan',
    designation: 'Municipal Observer & Public Relations',
    role: 'VIEWER',
    department: 'Operations',
    email: 'meera.k@kochimetro.org',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    badge: 'Observer / PR',
    badgeColor: 'bg-sky-500 text-slate-950',
    permissions: ['VIEW_DASHBOARD', 'VIEW_GRAPH', 'SEARCH_ARCHIVE', 'VOICE_ASSISTANT'],
    keyDuties: 'Station telemetries read-only viewing, public corridor advisories & knowledge graph exploration.',
  },
};

interface AuthContextType {
  currentUser: User;
  currentProfile: RoleProfile;
  allProfiles: RoleProfile[];
  setRole: (role: UserRole) => void;
  setDepartment: (dept: DepartmentName) => void;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('kmrl_role') as UserRole;
    return saved && KMRL_ROLE_PROFILES[saved] ? saved : 'ADMIN';
  });

  const profile = KMRL_ROLE_PROFILES[currentRole];

  const [currentUser, setCurrentUser] = useState<User>({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    department: profile.department,
    avatarUrl: profile.avatarUrl,
    designation: profile.designation,
    permissions: profile.permissions,
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const setRole = (role: UserRole) => {
    if (!KMRL_ROLE_PROFILES[role]) return;
    const newProfile = KMRL_ROLE_PROFILES[role];
    setCurrentRole(role);
    setCurrentUser({
      id: newProfile.id,
      name: newProfile.name,
      email: newProfile.email,
      role: newProfile.role,
      department: newProfile.department,
      avatarUrl: newProfile.avatarUrl,
      designation: newProfile.designation,
      permissions: newProfile.permissions,
    });
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
        currentProfile: profile,
        allProfiles: Object.values(KMRL_ROLE_PROFILES),
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
