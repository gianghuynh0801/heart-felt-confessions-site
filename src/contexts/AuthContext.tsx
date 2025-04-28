
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("heartUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - in a real app, you would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password.length >= 6) {
          const mockUser = {
            id: `user-${Date.now()}`,
            email,
            name: email.split('@')[0],
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem("heartUser", JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    // Mock signup - in a real app, you would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password.length >= 6 && name) {
          const mockUser = {
            id: `user-${Date.now()}`,
            email,
            name,
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem("heartUser", JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error("Invalid registration data"));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("heartUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
