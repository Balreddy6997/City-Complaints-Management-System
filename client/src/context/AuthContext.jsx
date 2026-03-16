import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("scms_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("scms_token") || null);

  const login = (userData, tok) => {
    setUser(userData);
    setToken(tok);
    localStorage.setItem("scms_user", JSON.stringify(userData));
    localStorage.setItem("scms_token", tok);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("scms_user");
    localStorage.removeItem("scms_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
