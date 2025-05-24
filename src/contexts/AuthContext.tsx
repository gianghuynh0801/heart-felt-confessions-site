
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user: authenticatedUser, error } = await authService.signIn(email, password);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      throw new Error(error);
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const { user: newUser, error } = await authService.signUp(email, password, name);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      throw new Error(error);
    }

    if (newUser) {
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
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
