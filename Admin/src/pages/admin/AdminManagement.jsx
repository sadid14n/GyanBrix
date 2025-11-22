import { useState } from "react";
import { makeAdmin, removeAdmin } from "../../AdminAction/adminActions";
import { firebaseAuth } from "../../firebase/firebaseConfig";

export default function AdminManagement() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const assignAdmin = async () => {
    try {
      const res = await makeAdmin(phoneNumber);
      alert(res.data.message);

      // Force refresh to get new role
      await firebaseAuth.currentUser.getIdToken(true);
      await firebaseAuth.currentUser.reload();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const revokeAdmin = async () => {
    try {
      const res = await removeAdmin(phoneNumber);
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Role Manager</h2>

      <input
        type="tel"
        placeholder="Enter phone number (e.g. +91XXXXXXXXXX)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
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
