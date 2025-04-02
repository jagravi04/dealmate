
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { currentUser } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Simulate checking for an existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would check for a valid token in localStorage
        // and validate it with your backend
        const savedUser = localStorage.getItem("dealmate_user");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, you would make an API call to validate credentials
      // For demo, we'll simulate a successful login with the mock user
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === currentUser.email && password === "password") {
        setUser(currentUser);
        localStorage.setItem("dealmate_user", JSON.stringify(currentUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${currentUser.name}!`,
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // In a real app, you would make an API call to register the user
      // For demo, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem("dealmate_user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dealmate_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
