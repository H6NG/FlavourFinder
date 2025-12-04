// Share.jsx
import React, { useState } from "react";

const BACKEND = "https://c2tp-backend-python.onrender.com";

export default function SharePage() {
  const [username, setUsername] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  // ------- UI Styles (same as Settings.jsx) -------
  const cardStyle = {
    background: "white",
    borderRadius: 12,
    padding: "25px 30px",
    border: "1px solid #e5e7eb",
    marginBottom: 30,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const inputStyle = {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    marginTop: 8,
  };

  const buttonPrimary = {
    background: "#2563eb",
    color: "white",
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "12px",
  };

  // -------- Submit post --------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      username,
      restaurant,
      rating: Number(rating),
      comments,
      commentBack: [],
    };

    const res = await fetch(`${BACKEND}/api/sharePost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Post shared successfully!");
      setUsername("");
      setRestaurant("");
      setRating("");
      setComments("");
    } else {
      setMessage(data.error || "Failed to share post.");
    }
  };

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
        Share Your Review
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

      <div style={cardStyle}>
        <h2 style={{ marginBottom: 15 }}>Create a Post</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          {/* Username */}
          <div>
            <label style={{ fontWeight: 500 }}>Username</label>
            <input
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>

          {/* Restaurant */}
          <div>
            <label style={{ fontWeight: 500 }}>Restaurant</label>
            <input
              style={inputStyle}
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="Restaurant name"
            />
          </div>

          {/* Rating */}
          <div>
            <label style={{ fontWeight: 500 }}>Rating (1–5)</label>
            <select
              style={{ ...inputStyle, width: "150px" }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Choose…</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div>
            <label style={{ fontWeight: 500 }}>Comments</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100 }}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write your review..."
            />
          </div>

          <button type="submit" style={buttonPrimary}>
            Share Post
          </button>
        </form>

        {/* FUTURE (UI ONLY) */}
        <div style={{ marginTop: 25, textAlign: "right" }}>
          <button
            style={{
              background: "#fff",
              border: "1px solid #2563eb",
              color: "#2563eb",
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Follow User
          </button>
        </div>
      </div>
    </div>
  );
}
