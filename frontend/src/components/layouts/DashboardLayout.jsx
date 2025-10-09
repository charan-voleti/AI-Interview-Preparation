import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Show loading state while fetching user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login to access the dashboard
      </div>
    );
  }

  // Render the dashboard layout with Navbar and children
  return (
    <div className="min-h-screen">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
