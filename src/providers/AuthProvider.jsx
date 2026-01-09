import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

const tokenKey = 'micu_token';
const userKey = 'micu_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(userKey);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(tokenKey, token);
    } else {
      localStorage.removeItem(tokenKey);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(userKey);
    }
  }, [user]);

  const login = (authResponse) => {
    setToken(authResponse.token);
    setUser(authResponse.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: Boolean(token)
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

