import React from "react";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      console.log("Google login successful:", user);
    } catch (err) {
      console.error("Google login failed:", err.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-red-500 text-white rounded-md"
    >
      Sign in with Google
    </button>
  );
};

export default LoginPage;
