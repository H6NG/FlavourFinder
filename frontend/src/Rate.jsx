// Rate.jsx
import React, { useEffect, useState } from "react";
import { getCookie } from "./utility/cookies.js";

const BACKEND = "https://c2tp-backend-python.onrender.com";

export default function RatePage() {
  const accessToken = getCookie("accessToken");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Same card style as Settings.jsx
  const cardStyle = {
    background: "white",
    borderRadius: 12,
    padding: "25px 30px",
    border: "1px solid #e5e7eb",
    marginBottom: 30,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const buttonPrimary = {
    background: "#2563eb",
    color: "white",
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "14px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
    fontFamily: "Inter, Arial, sans-serif",
    resize: "vertical",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/getHistory`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await res.json();
        const history = data.history || [];

        // Top 3 most recent
        const top3 = history.slice(0, 3);

        // Normalize fields to prevent crashes
        const normalized = top3.map((h) => ({
          ...h,
          rating: typeof h.rating === "number" ? h.rating : "",
          comment:
            typeof h.notes === "string"
              ? h.notes
              : h.notes && typeof h.notes === "object"
              ? JSON.stringify(h.notes)
              : "",
        }));

        setItems(normalized);
      } catch (err) {
        setError("Unable to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const submitRating = async (item, index) => {
    if (!item.rating || item.rating < 1 || item.rating > 5) {
      alert("Please choose a rating from 1 to 5.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${BACKEND}/api/updateHistory`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyId: item._id,
          rating: item.rating,
          notes: item.comment,
        }),
      });

      if (!res.ok) {
        alert("Error saving rating.");
        return;
      }

      alert("Rating saved!");

      // Remove rated item from list
      const clone = [...items];
      clone.splice(index, 1);
      setItems(clone);
    } catch {
      alert("Failed to submit rating.");
    }

    setSaving(false);
  };

  // -------------------------------
  // Loading / Error / Empty state
  // -------------------------------
  if (loading)
    return (
      <div style={{ padding: 30, maxWidth: 650, margin: "0 auto" }}>
        <h1>Rate Restaurants</h1>
        <p>Loading…</p>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 30, maxWidth: 650, margin: "0 auto" }}>
        <h1>Rate Restaurants</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  if (!items.length)
    return (
      <div style={{ padding: 30, maxWidth: 650, margin: "0 auto" }}>
        <h1>Rate Restaurants</h1>
        <div style={cardStyle}>No restaurants to rate right now!</div>
      </div>
    );

  // -------------------------------
  // MAIN UI (MATCH SETTINGS)
  // -------------------------------
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
        Rate Restaurants
      </h1>

      <p style={{ marginBottom: 25, color: "#444" }}>
        You can rate the last 3 places you visited.
      </p>

      {items.map((item, index) => (
        <div key={item._id} style={cardStyle}>
          <h2 style={{ marginBottom: 8 }}>{item.restaurantName}</h2>

          <div style={{ fontSize: 15, color: "#555", marginBottom: 14 }}>
            <strong>Visited:</strong>{" "}
            {item.visitedAt
              ? new Date(item.visitedAt).toLocaleString()
              : "Unknown"}
          </div>

          {/* Rating */}
          <label style={{ fontWeight: 500 }}>
            Rating (1–5):
            <select
              value={item.rating}
              onChange={(e) => {
                const clone = [...items];
                clone[index].rating = Number(e.target.value);
                setItems(clone);
              }}
              style={{
                marginLeft: 12,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            >
              <option value="">Choose</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </label>

          {/* Comment */}
          <textarea
            placeholder="Write a comment…"
            value={item.comment}
            onChange={(e) => {
              const clone = [...items];
              clone[index].comment = e.target.value;
              setItems(clone);
            }}
            style={{
              ...inputStyle,
              marginTop: 16,
              minHeight: 80,
            }}
          />

          <button
            disabled={saving}
            onClick={() => submitRating(item, index)}
            style={buttonPrimary}
          >
            {saving ? "Saving…" : "Submit Rating"}
          </button>
        </div>
      ))}
    </div>
  );
}
