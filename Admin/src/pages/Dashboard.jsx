import React, { useState } from "react";
import LoginPage from "./Auth/LoginPage";
import { useAuth } from "../context/AuthContext";
import { addClass } from "../services/classManager";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [className, setClassName] = useState("");

  if (user)
    return (
      <>
        <h1 className="bg-pink-400">Welcome {profile?.name}</h1>

        <div className="bg-purple-300 w-full h-screen flex items-center justify-center flex-col">
          <h2 className="text-5xl font-bold">Add a Class</h2>
          <div>
            <input
              type="text"
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="border-2  w-full py-3 px-10 my-4"
            />
            <button
              className="bg-red-500 text-white px-4 py-3 rounded-md"
              onClick={() => {
                addClass(className, user);
                setClassName("");
              }}
            >
              Add Class
            </button>
          </div>
        </div>
      </>
    );

  return (
    <>
      <LoginPage />
    </>
  );
};

export default Dashboard;
