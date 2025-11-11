import { useState } from "react";
import { makeAdmin, removeAdmin } from "../../AdminAction/adminActions";

export default function AdminManagement() {
  const [email, setEmail] = useState("");

  const assignAdmin = async () => {
    try {
      const res = await makeAdmin(email);
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const revokeAdmin = async () => {
    try {
      const res = await removeAdmin(email);
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Role Manager</h2>

      <input
        type="email"
        placeholder="Enter email to make admin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={assignAdmin}>Make Admin</button>
        <button onClick={revokeAdmin} style={{ marginLeft: 10 }}>
          Remove Admin
        </button>
      </div>
    </div>
  );
}
