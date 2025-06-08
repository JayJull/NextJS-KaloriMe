import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// Provider untuk membungkus semua komponen
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cek localStorage saat pertama kali dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
