// Authentication Context for managing auth state

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  mfaToken: string | null;
  setMfaToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [mfaToken, setMfaTokenState] = useState<string | null>(null);

  useEffect(() => {
    // Load auth state from localStorage on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const login = (user: string, authToken: string) => {
    setToken(authToken);
    setUsername(user);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('username', user);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setMfaTokenState(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  };

  const setMfaToken = (token: string | null) => {
    setMfaTokenState(token);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        username,
        token,
        login,
        logout,
        mfaToken,
        setMfaToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


