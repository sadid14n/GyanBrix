import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../../firebase/firebaseConfig";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        alert("No user found. Please log in again.");
        navigate("/login");
        return;
      }

      // 🔹 Create Firestore document
      await setDoc(doc(firestoreDB, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phoneNumber: user.phoneNumber || "",
        createdAt: new Date().toISOString(),
      });

      alert("Account created successfully!");
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to save user details. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-blue-600 text-center">
          Create Admin Account
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Enter your details to continue
        </p>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
