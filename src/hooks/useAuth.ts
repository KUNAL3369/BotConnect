import { useState, useCallback } from 'react';
import { AuthState, User } from '../types';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract name from email for demo purposes
    const name = email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    const user: User = {
      id: '1',
      email,
      name: capitalizedName,
    };
    
    setAuthState({
      isAuthenticated: true,
      user,
    });
    
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  }, []);

  return {
    ...authState,
    login,
    logout,
    isLoading,
  };
}