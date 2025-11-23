import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="bg-white shadow-md rounded-lg p-6 w-80 text-center">
        <h1 className="text-xl font-semibold mb-4">User Details</h1>

        {profile ? (
          <div className="space-y-2">
            {profile.photoURL && (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
            )}
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            {profile.name && (
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
            )}
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
          </div>
        ) : (
          <p>No profile found.</p>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md w-full"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 ">
        <Link
          to="/admin"
          className="px-5 py-2 rounded-lg text-2xl bg-accent cursor-pointer"
        >
          Go To Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
