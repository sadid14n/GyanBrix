import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { profile, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!profile) return null;
  return <div>{profile.role}</div>;
};

export default Dashboard;
