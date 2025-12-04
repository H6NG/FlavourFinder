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

  // ---------------------------------------------------------
  // Fetch 3 most recent history entries
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/getHistory`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Backend error:", data);
          throw new Error("Failed to load history");
        }

        const history = data.history || [];
        const top3 = history.slice(0, 3);

        // SAFELY NORMALIZE fields to avoid React errors
        const withTempFields = top3.map((h) => ({
          ...h,

          // rating must be a number or ""
          rating: typeof h.rating === "number" ? h.rating : "",

          // notes must be a string, never an object
          comment:
            typeof h.notes === "string"
              ? h.notes
              : h.notes && typeof h.notes === "object"
              ? JSON.stringify(h.notes)
              : "",
        }));

        setItems(withTempFields);
      } catch (err) {
        console.error("Fetch history error:", err);
        setError("Unable to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ---------------------------------------------------------
  // Submit rating to backend
  // ---------------------------------------------------------
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

      const data = await res.json();

      if (!res.ok) {
        console.error("Rating error:", data);
        alert("Error saving rating: " + (data.error || "unknown error"));
        return;
      }

      alert("Rating saved!");

      // Remove rated item from UI (optional)
      const clone = [...items];
      clone.splice(index, 1);
      setItems(clone);
    } catch (err) {
      console.error("Rating submit error:", err);
      alert("Failed to submit rating.");
    }

    setSaving(false);
  };

  // ---------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="content-container" style={{ padding: "20px" }}>
        <h2>Rate Your Recent Restaurants</h2>
        <p>Loading history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container" style={{ padding: "20px" }}>
        <h2>Rate Your Recent Restaurants</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        className="content-container"
        style={{
          padding: "40px 20px",
          maxWidth: "650px",
          marginLeft: "20px",
          marginRight: "auto",
        }}
      >
        <h2>Rate Your Recent Restaurants</h2>
        <p style={{ marginTop: "10px" }}>
          No restaurants to rate right now.
        </p>
      </div>
    );
  }

  return (
    <div
      className="content-container"
      style={{
        padding: "20px",
        maxWidth: "650px",
        marginLeft: "20px",
        marginRight: "auto",
      }}
    >
      <h2>Rate Your Recent Restaurants</h2>
      <p style={{ marginBottom: "15px" }}>
        You can rate the last 3 places you visited.
      </p>

      {items.map((item, index) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            background: "#fafafa",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 5px" }}>
            {item.restaurantName || "Unnamed Restaurant"}
          </h3>

          <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: 8 }}>
            Visited at:{" "}
            {item.visitedAt
              ? new Date(item.visitedAt).toLocaleString()
              : "Unknown date"}
          </div>

          {/* Rating Dropdown */}
          <label style={{ display: "block", marginTop: "8px" }}>
            Rating (1–5):
            <select
              value={item.rating}
              style={{ marginLeft: "10px" }}
              onChange={(e) => {
                const clone = [...items];
                clone[index].rating = Number(e.target.value);
                setItems(clone);
              }}
            >
              <option value="">Choose</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} / 5
                </option>
              ))}
            </select>
          </label>

          {/* Comment Box */}
          <textarea
            placeholder="Write a comment…"
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "8px",
              resize: "vertical",
              minHeight: "60px",
            }}
            value={item.comment}
            onChange={(e) => {
              const clone = [...items];
              clone[index].comment = e.target.value;
              setItems(clone);
            }}
          />

          {/* Submit Button */}
          <button
            disabled={saving}
            onClick={() => submitRating(item, index)}
            style={{
              marginTop: "10px",
              background: "#2196F3",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {saving ? "Saving…" : "Submit Rating"}
          </button>
        </div>
      ))}
    </div>
  );
}
