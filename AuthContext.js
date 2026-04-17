import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [upiPin, setUpiPin] = useState(null);
  const [appLockEnabled, setAppLockEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPin = localStorage.getItem('upiPin');
    const savedAppLock = localStorage.getItem('appLockEnabled');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    if (savedPin) {
      setUpiPin(savedPin);
    }
    if (savedAppLock) {
      setAppLockEnabled(JSON.parse(savedAppLock));
    }
  }, []);

  const login = (userData, pin) => {
    setUser(userData);
    setUpiPin(pin);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('upiPin', pin);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const setUpiPinHandler = (pin) => {
    setUpiPin(pin);
    localStorage.setItem('upiPin', pin);
  };

  const toggleAppLock = () => {
    const newState = !appLockEnabled;
    setAppLockEnabled(newState);
    localStorage.setItem('appLockEnabled', JSON.stringify(newState));
  };

  const toggleBiometric = () => {
    const newState = !biometricEnabled;
    setBiometricEnabled(newState);
  };

  const verifyUpiPin = (enteredPin) => {
    return enteredPin === upiPin;
  };

  const value = {
    isAuthenticated,
    user,
    upiPin,
    appLockEnabled,
    biometricEnabled,
    login,
    logout,
    updateProfile,
    setUpiPinHandler,
    toggleAppLock,
    toggleBiometric,
    verifyUpiPin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
