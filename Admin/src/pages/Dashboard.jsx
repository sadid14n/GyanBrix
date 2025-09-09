import React, { useState } from "react";
import { useFirebase } from "../Firebase/Firebase";

const Dashboard = () => {
  const firebase = useFirebase();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChnage = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await firebase.signupUserWithEmailAndPassword(
      form.email,
      form.password
    );
    console.log("User created: ", res);
    setForm({
      email: "",
      password: "",
    });
  };
  return (
    <>
      <div className="flex flex-col gap-10">
        <input
          type="text"
          name="email"
          value={form.email}
          onChange={handleChnage}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChnage}
          placeholder="Password"
        />

        <button className="border-2 w-18 rounded-lg" onClick={handleSubmit}>
          submit
        </button>
      </div>
    </>
  );
};

export default Dashboard;
