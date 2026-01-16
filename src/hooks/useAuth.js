import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * useAuth Hook
 * Custom hook to use authentication context
 * Throws error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default useAuth;
