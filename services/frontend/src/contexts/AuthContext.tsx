import { User } from "@quote-generator/shared";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/authService";
import { tokenService } from "../services/tokenService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleAuthRequired = () => {
      logout();
    };

    window.addEventListener("auth:required", handleAuthRequired);

    return () => {
      window.removeEventListener("auth:required", handleAuthRequired);
    };
  }, []);

  useEffect(() => {
    const validateAuth = async () => {
      if (tokenService.hasToken()) {
        try {
          const response = await fetch("http://localhost:3000/auth/validate", {
            headers: {
              Authorization: `Bearer ${tokenService.getToken()}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.valid && data.user) {
              setUser(data.user);
              setIsAuthenticated(true);
            } else {
              logout();
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token validation error:", error);
          logout();
        }
      }
    };

    validateAuth();
  }, []);

  const login = (token: string, userData: User) => {
    tokenService.setToken(token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
