
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Simple authentication for demo purposes
  // In a real application, you would connect to a backend server
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, accept any valid email and password with minimum length
    if (email && password && password.length >= 6) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        role: 'admin',
      };
      
      localStorage.setItem('adminUser', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    // Similar simplified logic for signup
    if (email && password && password.length >= 6) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        role: 'admin',
      };
      
      localStorage.setItem('adminUser', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
