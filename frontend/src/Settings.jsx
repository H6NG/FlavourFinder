import React, { useEffect, useState } from "react";
import { getCookie } from "./utility/cookies";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // DEFAULT VALUES to prevent undefined errors
  const [preferences, setPreferences] = useState({
    glutenFree: false,
    vegetarian: false,
    vegan: false,
  });

  const [message, setMessage] = useState("");

  const accessToken = getCookie("accessToken");

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await fetch(
          "https://c2tp-backend-python.onrender.com/api/getUserSelf",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const userData = await resUser.json();

        const resPrefs = await fetch(
          "https://c2tp-backend-python.onrender.com/api/getPreferences",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const prefData = await resPrefs.json();

        setUser(userData);
        if (prefData.preferences) setPreferences(prefData.preferences);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return <div style={{ padding: 30 }}>Loading settings...</div>;

  // -------------------
  // UPDATE USER INFO
  // -------------------
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const body = {
      email: form.get("email"),
      userName: form.get("username"),
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
    };

    const res = await fetch(
      "https://c2tp-backend-python.onrender.com/api/updateUserInfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    setMessage(res.ok ? "Profile updated!" : "Update failed.");
  };

  // -------------------
  // UPDATE PREFERENCES
  // -------------------
  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const body = {
      glutenFree: form.get("glutenFree") === "on",
      vegetarian: form.get("vegetarian") === "on",
      vegan: form.get("vegan") === "on",
    };

    const res = await fetch(
      "https://c2tp-backend-python.onrender.com/api/updatePreferences",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    setMessage(res.ok ? "Preferences updated!" : "Update failed.");
  };

  // -------------------
  // CHANGE PASSWORD
  // -------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const body = {
      oldPassword: form.get("oldPassword"),
      newPassword: form.get("newPassword"),
    };

    const res = await fetch(
      "https://c2tp-backend-python.onrender.com/api/changePassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    setMessage(res.ok ? "Password changed!" : "Wrong old password.");
  };

  // -------------------
  // DELETE ACCOUNT
  // -------------------
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    const res = await fetch(
      "https://c2tp-backend-python.onrender.com/api/deleteAccount",
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.ok) {
      document.cookie = "accessToken=; Max-Age=0;";
      document.cookie = "refreshToken=; Max-Age=0;";
      window.location.href = "/";
    } else {
      setMessage("Delete failed.");
    }
  };

  // ====================================================
  // ---------------------- UI STYLES --------------------
  // ====================================================

  const cardStyle = {
    background: "white",
    borderRadius: 12,
    padding: "25px 30px",
    border: "1px solid #e5e7eb",
    marginBottom: 30,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const inputStyle = {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    width: "100%",
  };

  const buttonPrimary = {
    background: "#2563eb",
    color: "white",
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "10px",
  };

  const buttonDanger = {
    background: "#dc2626",
    color: "white",
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
  };

  // ====================================================
  // --------------------- RENDER UI --------------------
  // ====================================================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "650px",
        margin: "0 auto",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 25, fontSize: 32, fontWeight: 600 }}>
        Settings
      </h1>

      {message && (
        <div
          style={{
            background: "#e6ffed",
            border: "1px solid #b6e6c3",
            color: "#23693c",
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 25,
          }}
        >
          {message}
        </div>
      )}

      {/* ---------------- PROFILE UPDATE ---------------- */}
<div style={cardStyle}>
  <h2 style={{ marginBottom: 20 }}>Profile Info</h2>

  <form
    onSubmit={handleUpdateInfo}
    style={{ display: "flex", flexDirection: "column", gap: 18 }}
  >
    {/* Email */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ marginBottom: 6, fontWeight: 500 }}>Email</label>
      <input
        name="email"
        defaultValue={user.email}
        style={inputStyle}
        placeholder="Email"
      />
    </div>

    {/* Username */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ marginBottom: 6, fontWeight: 500 }}>Username</label>
      <input
        name="username"
        defaultValue={user.userName}
        style={inputStyle}
        placeholder="Username"
      />
    </div>

    {/* First Name */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ marginBottom: 6, fontWeight: 500 }}>First Name</label>
      <input
        name="firstName"
        defaultValue={user.firstName}
        style={inputStyle}
        placeholder="First Name"
      />
    </div>

    {/* Last Name */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ marginBottom: 6, fontWeight: 500 }}>Last Name</label>
      <input
        name="lastName"
        defaultValue={user.lastName}
        style={inputStyle}
        placeholder="Last Name"
      />
    </div>

    <button type="submit" style={buttonPrimary}>
      Update Info
    </button>
  </form>
</div>


      {/* ---------------- PREFERENCES ---------------- */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: 15 }}>Preferences</h2>
        <form
          onSubmit={handleUpdatePreferences}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" name="glutenFree" defaultChecked={preferences.glutenFree} />
            Gluten-Free
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" name="vegetarian" defaultChecked={preferences.vegetarian} />
            Vegetarian
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" name="vegan" defaultChecked={preferences.vegan} />
            Vegan
          </label>

          <button type="submit" style={buttonPrimary}>
            Update Preferences
          </button>
        </form>
      </div>

      {/* ---------------- CHANGE PASSWORD ---------------- */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: 15 }}>Change Password</h2>
        <form
          onSubmit={handleChangePassword}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <input type="password" name="oldPassword" placeholder="Old Password" style={inputStyle} />
          <input type="password" name="newPassword" placeholder="New Password" style={inputStyle} />

          <button type="submit" style={buttonPrimary}>
            Change Password
          </button>
        </form>
      </div>

      {/* ---------------- DELETE ACCOUNT ---------------- */}
      <div
        style={{
          ...cardStyle,
          background: "#fff5f5",
          border: "1px solid #f5cccc",
        }}
      >
        <h2 style={{ color: "#b91c1c", marginBottom: 15 }}>Danger Zone</h2>
        <button onClick={handleDelete} style={buttonDanger}>
          Delete My Account
        </button>
      </div>
    </div>
  );
}
