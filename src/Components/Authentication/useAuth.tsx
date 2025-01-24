import { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../../models/User";
import apiAgent from "../../utils/apiAgent";
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: (_email: string, _password: string) => {
    return new Promise(() => {});
  },
  logout: () => {
    return new Promise(() => {});
  },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authUser: User | null = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null;
  const [user, setUser] = useState<User | null>(authUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("refreshToken")
  );

  const login = async (email: string, password: string) => {
    const response = await apiAgent.Auth.login({ email, password });
    const responseUser = response?.user;
    console.log(responseUser);
    console.log(responseUser);
    const { refreshToken, accessToken } = response?.token;
    if (accessToken && refreshToken && responseUser) {
      setUser(response);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: responseUser.id,
          firstName: responseUser.firstName,
          lastName: responseUser.lastName,
        })
      );
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const response = await apiAgent.Auth.logout({
        refreshToken,
      });
      console.log(response?.message);
      window.notify("success", response?.message);

      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsAuthenticated(false);
      setUser(null);

      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
