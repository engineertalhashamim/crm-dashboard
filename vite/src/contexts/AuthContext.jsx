import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('check Auth log chalo 1...');
      const res = await axios.get('http://localhost:8000/api/v1/user/checkauth', {
        withCredentials: true
      });
      console.log('check Auth log chalo 2...', res);

      setUserData(res);
      console.log('check Auth log...', userData);
    } catch {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  //     const login = async (username, password) => {
  //     const res = await axios.post(
  //       "http://localhost:8000/api/v1/user/loginuser",
  //       { username, password },
  //       { withCredentials: true }
  //     );
  //     setUser(res.data.data);
  //     return res.data;
  //   };

  //   const logout = async () => {
  //     await axios.post("http://localhost:8000/api/v1/user/logout", {}, { withCredentials: true });
  //     setUser(null);
  //   };

  return <AuthContext.Provider value={{ userData, setUserData, loading, setLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
