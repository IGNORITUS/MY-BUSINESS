import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { useNotification } from '../hooks/useNotification';
import { validateForm } from '../utils/validation';

interface SecurityContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  validateSession: () => Promise<boolean>;
  checkPermission: (permission: string) => boolean;
  handleLogout: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: showError } = useNotification();
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, error } = useSelector((state: RootState) => state.security);

  useEffect(() => {
    const validateInitialSession = async () => {
      try {
        await validateSession();
      } catch (error) {
        console.error('Session validation failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    validateInitialSession();
  }, []);

  const validateSession = async (): Promise<boolean> => {
    try {
      // Здесь будет логика проверки сессии
      return true;
    } catch (error) {
      showError('Ошибка проверки сессии');
      return false;
    }
  };

  const checkPermission = (permission: string): boolean => {
    // Здесь будет логика проверки прав доступа
    return true;
  };

  const handleLogout = () => {
    // Здесь будет логика выхода из системы
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    isLoading,
    error,
    validateSession,
    checkPermission,
    handleLogout,
  };

  return (
    <SecurityContext.Provider value={value}>
      {!isLoading && children}
    </SecurityContext.Provider>
  );
};

export default SecurityContext; 