import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Create the context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch user profile on mount if token exists
  useEffect(() => {
    if (user) return; // If user is already set, do nothing

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false); // No token, stop loading
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data); // Set user from API
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser(); // Clear invalid token/user
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUser();
  }, [user]);

  // Update user data and save token
  const updateUser = (userData) => {
    setUser(userData);
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
    setLoading(false);
  };

  // Clear user data and remove token
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
