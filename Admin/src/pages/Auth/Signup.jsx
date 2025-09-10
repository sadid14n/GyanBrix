import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);

    const res = await signup(form.email, form.password);
    console.log(res);
  };

  return (
    <div>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="email"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="password"
      />
      <input
        type="text"
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="role"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Signup;
